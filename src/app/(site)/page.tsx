import { prisma } from "@/lib/prisma";
import SectionRenderer from "@/components/Site/SectionRenderer/SectionRenderer";
import { Metadata } from "next";
import { getSiteSettings, loadMetadata } from "../actions";
import { trackEvent } from "@/lib/tracking";
import PageTracker from "@/components/Analytics/PageTracker";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await loadMetadata();
  return {
    title: `Главная | ${meta?.data?.title || "Computer-Service-Site"}`,
    description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
  };
}

export default async function Home() {
  const response = await getSiteSettings();
  const settings = response.data || {};

  const pageStructure = await prisma.site_pages.findUnique({
    where: { slug: "/" },
    include: {
      sections: {
        where: { is_active: true },
        orderBy: { display_order: "asc" },
      }
    }
  });

  // trackEvent('page_open');

  return (
    <div className="main-page">
      <PageTracker path="/" event="page_open" />
      <SectionRenderer 
        customSections={[]}
        sections={pageStructure?.sections || []} 
        settings={settings} 
      />
    </div>
  );
}