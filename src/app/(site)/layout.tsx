import type { Metadata } from "next";
import AppLayout from "@/components/AppLayout";
import { getSiteSettings, loadMetadata } from "../actions";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await loadMetadata();
  return {
    title: meta?.data?.title || "Computer-Service-Site",
    description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [response, pageLinks, legalDocuments] = await Promise.all([
    getSiteSettings(),
    prisma.sitePage.findMany({
      where: { display_in_navigation: true },
      select: { id: true, name: true, slug: true },
    }),
    prisma.legalDocument.findMany({
      where: { is_active: true },
      orderBy: [{ display_order: "asc" }, { id: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        url: true,
        url_type: true,
        show_in_footer: true,
        show_in_modal: true,
      },
    }),
  ]);

  const settings = response.data || {};

  return (
    <AppLayout
      siteSettings={settings}
      pageLinks={pageLinks}
      legalDocuments={legalDocuments}
    >
      {children}
    </AppLayout>
  );
}