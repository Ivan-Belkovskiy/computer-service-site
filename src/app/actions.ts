'use server';

import { prisma } from "@/lib/prisma";

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