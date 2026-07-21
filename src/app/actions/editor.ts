'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Page } from "../controlpanel/(protected)/editor/page";

export async function swapSectionsOrder(id1: number, order1: number, id2: number, order2: number) {
  try {
    await prisma.$transaction([
      prisma.page_sections.update({ where: { id: id1 }, data: { display_order: order1 } }),
      prisma.page_sections.update({ where: { id: id2 }, data: { display_order: order2 } }),
    ]);

    revalidatePath("/(site)", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to swap sections:", error);
    return { success: false, error: "Ошибка при изменении порядка" };
  }
}

export async function deleteSection(id: number) {
  try {
    await prisma.page_sections.delete({ where: { id } });
    revalidatePath("/(site)", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete section:", error);
    return { success: false, error: "Ошибка при удалении секции" };
  }
}

export async function createCustomSectionTemplate(name: string) {
  try {
    const template = await prisma.custom_sections.create({
      data: {
        name,
        content: [],
      }
    });
    return { success: true, data: template };
  } catch (error) {
    console.error("Failed to create template:", error);
    return { success: false, error: "Ошибка при создании шаблона" };
  }
}

export async function addSectionToPage(data: {
  pageId: number;
  type: string;
  name: string;
  customSectionId?: number;
  nextOrder: number;
}) {
  try {
    const newSection = await prisma.page_sections.create({
      data: {
        page_id: data.pageId,
        type: data.type,
        name: data.name,
        display_order: data.nextOrder,
        custom_section_id: data.customSectionId || null,
        props: {},
      }
    });

    revalidatePath("/(site)", "layout");
    return { success: true, data: newSection };
  } catch (error) {
    console.error("Failed to add section to page:", error);
    return { success: false, error: "Ошибка при добавлении секции" };
  }
}

export async function updateSectionProps(id: number, props: Record<string, any>) {
  try {
    await prisma.page_sections.update({
      where: { id },
      data: { props }
    });

    revalidatePath("/(site)", "layout");
    revalidatePath("/controlpanel/editor", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to update section props:", error);
    return { success: false, error: "Ошибка при сохранении настроек" };
  }
}

export async function createPage(name: string, url: string, displayInNavigation: boolean, description?: string) {
  try {
    await prisma.site_pages.create({
      data: {
        name,
        slug: url,
        description,
        displayInNavigation
      }
    });

    revalidatePath("/(site)", "layout");
    revalidatePath("/controlpanel/editor", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to create page:", error);
    return { success: false, error: "Ошибка при сохранении настроек" };
  }
}

export async function updatePage(id: number, data: Partial<Page>) {
  try {
    await prisma.site_pages.update({
      where: {
        id,
      },
      data: {
        ...data,
      }
    });

    revalidatePath("/(site)", "layout");
    revalidatePath("/controlpanel/editor", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to update page:", error);
    return { success: false, error: "Ошибка при сохранении настроек" };
  }
}


export async function deletePage(id: number) {
  try {
    await prisma.site_pages.delete({
      where: {
        id,
      },
    });

    revalidatePath("/(site)", "layout");
    revalidatePath("/controlpanel/editor", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to update page:", error);
    return { success: false, error: "Ошибка при сохранении настроек" };
  }
}