import type { Metadata } from "next";
import { loadMetadata } from "../actions";
import ControlPanelLayout from "@/components/ControlPanelLayout";
import { getSiteSettings } from "./(protected)/settings/actions";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await loadMetadata();
  return {
    title: `Панель Управления | ${meta?.data?.title || "Computer-Service-Site"}`,
    description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
  };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <ControlPanelLayout settings={settings}>
      {children}
    </ControlPanelLayout>
  );
}