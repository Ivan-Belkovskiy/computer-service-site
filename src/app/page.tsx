import FeaturesSection from "@/components/Site/FeaturesSection/FeaturesSection";
import HeroSection from "@/components/Site/HeroSection/HeroSection";
import ServicesSection from "@/components/Site/ServicesSection/ServicesSection";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Image from "next/image";

export type Service = Prisma.servicesGetPayload<{}>;

import { Metadata } from "next";
import { loadMetadata } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await loadMetadata();
  return {
    title: `Главная | ${meta?.data?.title || "Computer-Service-Site"}`,
    description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
  };
}

export default async function Home() {
  // const services: Service[] = await prisma.services.findMany({});

  return (
    <div className="main-page">
      <HeroSection />
      <ServicesSection
        title="Наши услуги"
        showCategories
        limit={3}
        globalPadding={25}
      />
      <FeaturesSection />
    </div>
  );
}
