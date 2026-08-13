import { prisma } from "@/lib/prisma";
import SectionRenderer from "@/components/Site/SectionRenderer/SectionRenderer";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSiteSettings } from "../../actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
//   const dbSlug = `/${slug}`;

  const page = await prisma.site_pages.findUnique({
    where: { slug: slug },
  });

  const response = await getSiteSettings();
  const settings = response.data || {};

  return {
    title: `${page?.name || "Страница"} | ${settings?.title || "Computer-Service-Site"}`,
    // description: page?.description || settings?.description || "Ремонт компьютеров",
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  
  const response = await getSiteSettings();
  const settings = response.data || {};

//   const dbSlug = `/${slug}`;

  const pageStructure = await prisma.site_pages.findUnique({
    where: { slug: slug },
    include: {
      sections: {
        where: { is_active: true },
        orderBy: { display_order: "asc" },
      }
    }
  });

  const customSections = await prisma.custom_sections.findMany({});

  if (!pageStructure) {
    notFound();
  }

  return (
    <div className={`page-${slug}`}>
      <SectionRenderer 
        sections={pageStructure.sections} 
        customSections={customSections}
        settings={settings} 
      />
    </div>
  );
}