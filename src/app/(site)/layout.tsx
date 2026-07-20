import type { Metadata } from "next";
import AppLayout from "@/components/AppLayout";
import { getSiteSettings, loadMetadata } from "../actions";

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

  return (
    <AppLayout siteSettings={settings}>
      {children}
    </AppLayout>
  );
}