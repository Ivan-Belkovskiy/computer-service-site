'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PropSchemaField } from "@/types/sections";
import { CustomSection } from "../controlpanel/(protected)/editor/page";

export async function createCustomSection(name: string, fields: PropSchemaField[]) {
  try {
    const section = await prisma.custom_sections.create({
      data: {
        name,
        props: fields as any[],
      },
    });

    revalidatePath("/controlpanel/editor");
    return { success: true, section };
  } catch (error) {
    console.error("Failed to create custom section:", error);
    return { success: false, error: "Не удалось создать шаблон секции" };
  }
}

export async function updateCustomSection(id: number, data: Partial<CustomSection>) {
  try {
    const updated = await prisma.custom_sections.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        props: data.props as any[],
        content: data.content as any[],
      }
    });

    revalidatePath('/controlpanel/editor/custom-sections/[id]');

    return { success: true, updated };
  } catch (error) {
    return { success: false, error: "Ошибка при обновлении секции " };
  }
}

export async function getCustomSections() {
  try {
    const sections = await prisma.custom_sections.findMany({
        orderBy: {
            id: 'asc',
        }
    //   orderBy: { createdAt: 'desc' },
    });
    return { success: true, sections };
  } catch (error) {
    console.error("Failed to fetch custom sections:", error);
    return { success: false, error: "Ошибка при получении секций" };
  }
}