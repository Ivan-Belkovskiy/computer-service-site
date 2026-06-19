import FeaturesSection from "@/components/Site/FeaturesSection/FeaturesSection";
import HeroSection from "@/components/Site/HeroSection/HeroSection";
import ServicesSection from "@/components/Site/ServicesSection/ServicesSection";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Image from "next/image";

export type Service = Prisma.servicesGetPayload<{}>;

export default async function Home() {
  // const services: Service[] = await prisma.services.findMany({});

  return (
    <div className="main-page">
      <HeroSection />
      <ServicesSection title="Наши услуги" /*services={services}*/ showCategories limit={3} />
      <FeaturesSection />
    </div>
  );
}
