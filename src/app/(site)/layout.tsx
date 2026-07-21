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
  const response = await getSiteSettings();
  const settings = response.data || {};

  const pageLinks = await prisma.site_pages.findMany({
    where: {
      displayInNavigation: true
    },
    select: {
      id: true,
      name: true,
      slug: true,
    }
  });

  return (
    <AppLayout siteSettings={settings} pageLinks={pageLinks}>
      {children}
    </AppLayout>
  );
}