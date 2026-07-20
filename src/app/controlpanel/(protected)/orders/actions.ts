'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export type ActionState = {
    success: boolean;
    error?: string;
} | null;

export async function updateOrder(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const orderId = parseInt(formData.get("orderId") as string, 10);
    const status = formData.get("status") as OrderStatus;
    const masterIdRaw = formData.get("masterId") as string;
    const totalPriceRaw = formData.get("totalPrice") as string;

    const master_id = masterIdRaw ? parseInt(masterIdRaw, 10) : null;
    const total_price = totalPriceRaw ? parseInt(totalPriceRaw, 10) : null;

    try {
        await prisma.orders.update({
            where: { id: orderId },
            data: { status, master_id, total_price },
        });

        revalidatePath("/controlpanel/orders");
        revalidatePath(`/controlpanel/orders/${orderId}`);

        return { success: true };
    } catch (error) {
        console.error("Ошибка обновления заявки:", error);
        return { success: false, error: "Не удалось сохранить изменения в базе данных." };
    }
}