import ServicesSection from "@/components/Site/ServicesSection/ServicesSection";
import { Metadata } from "next";
import { loadMetadata } from "../../actions";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await loadMetadata();
  return {
    title: `Услуги | ${meta?.data?.title || "Computer-Service-Site"}`,
    description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
  };
}

export default function ServicesPage() {
    return (
        <div className="services-page">
            <ServicesSection title="Услуги" showCategories  />
        </div>
    )
}