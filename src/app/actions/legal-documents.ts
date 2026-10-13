"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type LegalDocumentInput = {
  slug: string;
  title: string;
  url: string;
  url_type: "PAGE" | "EXTERNAL";
  is_active?: boolean;
  show_in_footer?: boolean;
  show_in_modal?: boolean;
};

const SLUG_RE = /^[a-z0-9_-]+$/;

export async function getLegalDocuments() {
  return prisma.legalDocument.findMany({
    orderBy: [{ display_order: "asc" }, { id: "asc" }],
  });
}

export async function createLegalDocument(data: LegalDocumentInput) {
  try {
    const slug = data.slug.trim().toLowerCase();
    const title = data.title.trim();
    const url = data.url.trim();

    if (!slug || !title || !url) {
      return { error: "Заполните slug, название и URL" };
    }
    if (!SLUG_RE.test(slug)) {
      return { error: "Slug: только латиница, цифры, дефис и подчёркивание" };
    }

    const max = await prisma.legalDocument.aggregate({
      _max: { display_order: true },
    });

    await prisma.legalDocument.create({
      data: {
        slug,
        title,
        url,
        url_type: data.url_type,
        is_active: data.is_active ?? true,
        show_in_footer: data.show_in_footer ?? true,
        show_in_modal: data.show_in_modal ?? false,
        display_order: (max._max.display_order ?? 0) + 1,
      },
    });

    revalidatePath("/controlpanel/settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") {
      return { error: "Документ с таким slug уже существует" };
    }
    console.error("[createLegalDocument]", e);
    return { error: "Не удалось создать документ" };
  }
}

export async function updateLegalDocument(
  id: number,
  data: Partial<LegalDocumentInput>,
) {
  try {
    const update: any = {};
    if (data.title !== undefined) update.title = data.title.trim();
    if (data.url !== undefined) update.url = data.url.trim();
    if (data.url_type !== undefined) update.url_type = data.url_type;
    if (data.is_active !== undefined) update.is_active = data.is_active;
    if (data.show_in_footer !== undefined)
      update.show_in_footer = data.show_in_footer;
    if (data.show_in_modal !== undefined)
      update.show_in_modal = data.show_in_modal;

    await prisma.legalDocument.update({ where: { id }, data: update });

    revalidatePath("/controlpanel/settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("[updateLegalDocument]", e);
    return { error: "Не удалось обновить документ" };
  }
}

export async function deleteLegalDocument(id: number) {
  try {
    await prisma.legalDocument.delete({ where: { id } });
    revalidatePath("/controlpanel/settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("[deleteLegalDocument]", e);
    return { error: "Не удалось удалить документ" };
  }
}

export async function reorderLegalDocuments(orderedIds: number[]) {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.legalDocument.update({
          where: { id },
          data: { display_order: index },
        }),
      ),
    );
    revalidatePath("/controlpanel/settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("[reorderLegalDocuments]", e);
    return { error: "Не удалось изменить порядок" };
  }
}