import ContactsSection from "@/components/Site/ContactsSection/ContactsSection";
import { Metadata } from "next";
import { getSiteSettings } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  const response = await getSiteSettings();
  const settings = response.data || {};

  return {
    title: `Контакты | ${settings["site_title"] || "Computer-Service-Site"}`,
    description: settings["site_description"] || "Ремонт компьютеров и ноутбуков",
  };
}

export default async function ContactsPage() {
  const response = await getSiteSettings();
  const settings = response.data || {};

  return (
    <div className="contacts-page">
      <ContactsSection initialSettings={settings} />
    </div>
  );
}