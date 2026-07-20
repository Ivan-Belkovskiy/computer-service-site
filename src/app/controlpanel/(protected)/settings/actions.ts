'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type SettingsActionState = {
    success: boolean;
    error?: string;
    message?: string;
} | null;

export async function getSiteSettings(): Promise<Record<string, string>> {
    const settingsArray = await prisma.site_settings.findMany();
    
    const settingsObject: Record<string, string> = {};
    settingsArray.forEach(item => {
        settingsObject[item.key] = item.value;
    });
    
    return settingsObject;
}

export async function updateSettings(prevState: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
    const keysToUpdate = [
        "site_title",
        "site_description",
        "contact_phone",
        "contact_email",
        "work_hours",
        "order_hours"
    ];

    try {
        await prisma.$transaction(
            keysToUpdate.map(key => {
                const value = (formData.get(key) as string) || "";
                return prisma.site_settings.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value },
                });
            })
        );
        
        revalidatePath("/");
        revalidatePath("/controlpanel/settings");

        return { success: true, message: "Настройки успешно сохранены!" };
    } catch (error) {
        console.error("Ошибка при сохранении настроек:", error);
        return { success: false, error: "Не удалось сохранить настройки в базе данных." };
    }
}