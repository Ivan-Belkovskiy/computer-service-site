'use server';

import { prisma } from "@/lib/prisma";
import { Service } from "./page";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";


import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_EXPIRATION = 7 * 24 * 60 * 60 * 1000; 

export type ActionState = {
  success: boolean;
  error?: string;
} | null;

export async function loginAdmin(prevState: ActionState, formData: FormData) {
  const login = formData.get("login") as string;
  const password = formData.get("password") as string;

  if (!login || !password) {
    return { success: false, error: "Заполните все поля" };
  }

  try {
    const admin = await prisma.admin_users.findUnique({ where: { login } });
    if (!admin) {
      return { success: false, error: "Неверный логин или пароль" };
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return { success: false, error: "Неверный логин или пароль" };
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", admin.login, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_EXPIRATION,
      path: "/",
    });

  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return { success: false, error: "Что-то пошло не так" };
  }

  redirect("/control-panel");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/control-panel/login");
}

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
                status: 'CREATED',
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

export async function getSiteSettings() {
  try {
    const settingsArray = await prisma.site_settings.findMany();
    
    const settingsObject = settingsArray.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);

    return { success: true, data: settingsObject };
  } catch (error) {
    console.error("Ошибка при получении настроек сайта:", error);
    return { success: false, error: "Не удалось загрузить настройки" };
  }
}

export async function updateSiteSetting(key: string, value: string) {
  try {
    await prisma.site_settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    
    revalidatePath("/", "layout"); 
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при обновлении настройки ${key}:`, error);
    return { success: false, error: "Не удалось сохранить настройку" };
  }
}