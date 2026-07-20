import type { Metadata } from "next";
import { loadMetadata } from "../actions";
import ControlPanelLayout from "@/components/ControlPanelLayout";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await loadMetadata();
  return {
    title: `Панель Управления | ${meta?.data?.title || "Computer-Service-Site"}`,
    description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
  };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ControlPanelLayout>
      {children}
    </ControlPanelLayout>
  );
}