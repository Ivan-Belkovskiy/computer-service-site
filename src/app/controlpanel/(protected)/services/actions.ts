'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ServiceActionState = {
    success: boolean;
    error?: string;
} | null;

export async function createService(prevState: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const device_type = formData.get("device_type") as any;
    const unit = formData.get("unit") as any;              
    const price = parseInt(formData.get("price") as string, 10);
    const slug = formData.get("slug") as string;
    const display_order = parseInt(formData.get("display_order") as string, 10);
    
    const isStartingPrice = formData.get("isStartingPrice") === "on";

    if (!name || isNaN(price) || !slug) {
        return { success: false, error: "Пожалуйста, заполните название, URL и цену услуги." };
    }

    try {
        await prisma.service.create({
            data: {
                name,
                description: description || null,
                device_type,
                unit,
                price,
                slug,
                display_order: isNaN(display_order) ? 10 : display_order,
                isStartingPrice,
            },
        });

        revalidatePath("/controlpanel/services");
    } catch (error) {
        console.error("Ошибка при создании услуги:", error);
        return { success: false, error: "Не удалось сохранить услугу в базе данных." };
    }

    redirect("/controlpanel/services");
}


export async function editService(prevState: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
    const service_id = parseInt(formData.get("service_id") as string, 10);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const device_type = formData.get("device_type") as any;
    const unit = formData.get("unit") as any;              
    const price = parseInt(formData.get("price") as string, 10);
    const slug = formData.get("slug") as string;
    const display_order = parseInt(formData.get("display_order") as string, 10);
    
    const isStartingPrice = formData.get("isStartingPrice") === "on";

    if (!service_id) return { success: false, error: "ID услуги не предоставлен!" };

    if (!name || isNaN(price)) {
        return { success: false, error: "Пожалуйста, заполните название и цену услуги." };
    }

    try {
        await prisma.service.update({
            where: {
                id: service_id,
            },
            data: {
                name,
                description: description || null,
                device_type,
                unit,
                price,
                display_order: isNaN(display_order) ? 10 : display_order,
                isStartingPrice,
            },
        });

        revalidatePath("/controlpanel/services");
    } catch (error) {
        console.error("Ошибка при редактировании услуги:", error);
        return { success: false, error: "Не удалось обновить услугу в базе данных." };
    }

    redirect("/controlpanel/services");
}

export async function deleteService(id: number) {
    try {
        await prisma.service.delete({
            where: { id },
        });
        
        revalidatePath("/controlpanel/services");
        return { success: true };
    } catch (error) {
        console.error("Ошибка при удалении услуги:", error);
        return { success: false, error: "Не удалось удалить услугу." };
    }
}