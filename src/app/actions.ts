'use server';

import { prisma } from "@/lib/prisma";
import { Service } from "./page";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";

export async function findOrAddClient(name: string, phone: string, email?: string) {
    if (!name || !phone) return { success: false, error: "Имя и телефон обязательны" };

    try {
        let client = await prisma.clients.findUnique({
            where: { phone }
        });

        if (client) {
            if (client.full_name !== name || (email && client.email !== email)) {
                client = await prisma.clients.update({
                    where: { phone },
                    data: { full_name: name, email: email || client.email }
                });
            }
            return { success: true, data: client };
        } else {
            const newClient = await prisma.clients.create({
                data: {
                    full_name: name,
                    phone,
                    email
                },
            });
            return { success: true, data: newClient };
        }
    } catch (error) {
        console.error('Client operation error: ', error);
        return { success: false, error: "Ошибка при обработке данных клиента" };
    }
}

export async function createOrder(
    clientName: string,
    clientPhone: string,
    description: string = "",
    email?: string,
    address?: string
) {
    if (!clientName || !clientPhone) return { success: false, error: "Имя и телефон обязательны" };

    try {
        const clientResult = await findOrAddClient(clientName, clientPhone, email);

        if (!clientResult.data) {
            return { success: false, error: "Не удалось привязать клиента к заявке" };
        }

        const orderResult = await prisma.orders.create({
            data: {
                client_id: clientResult.data.id,
                description,
                address,
                status: 'created',
            },
        });

        return { success: true, orderId: orderResult.id };
    } catch (error) {
        console.error('Order creation error: ', error);
        return { success: false, error: "Не удалось создать заявку" };
    }
}

export async function getServices() {
    try {
        const data = await prisma.services.findMany({
            orderBy: [
                { displayOrder: 'desc' }
            ]
        });

        return { success: true, data };

    } catch (error) {
        return { success: false, error };
    }
}

export async function updateServices(d: Service[]) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            await tx.services.deleteMany({});

            return await tx.services.createMany({
                data: d.map(s => ({
                    name: s.name,
                    price: s.price,
                    unit: s.unit,
                    isStartingPrice: s.isStartingPrice,
                    category: s.category,
                    description: s.description,
                    device_type: s.device_type,
                    displayOrder: s.displayOrder,
                }))
            });
        });

        revalidatePath('/');
        return { success: true, data: result };

    } catch (error) {
        console.error("Failed to update services:", error);
        return { success: false, error: "Не удалось обновить список услуг" };
    }
}

export async function saveMetadata(data: Metadata) {
    try {
        const filepath = path.join(process.cwd(), 'metadata.json');
        if (!data) throw new Error('Data not provided!');
        writeFileSync(filepath, JSON.stringify(data));

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function loadMetadata() {
    const placeholder = {
        title: 'Computer-Service-Site',
        description: 'No Description',
    };
    try {
        const filepath = path.join(process.cwd(), 'metadata.json');
        if (!existsSync(filepath)) return { success: true, data: placeholder };

        const data = readFileSync(filepath, {
            encoding: 'utf-8'
        });

        if (typeof data !== 'string') return;

        return { success: true, data: JSON.parse(data) };
    } catch (error) {
        return { success: false, error, data: placeholder };
    }
}