import SettingsForm from "./SettingsForm";
import { getSiteSettings } from "@/app/actions";
import "./page.css";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
    const pages = await prisma.site_pages.findMany({});

    const settings = await getSiteSettings();

    if (!settings.data) return <div className="settings-page-wrapper">Error! Settings.data Not Provided!</div>

    return (
        <div className="settings-page-wrapper" style={{ backgroundColor: '#f9fafb' }}>
            <SettingsForm allPages={pages} initialSettings={settings.data} />
        </div>
    );
}