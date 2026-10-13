import SettingsForm from "./SettingsForm";
import { getSiteSettings } from "@/app/actions";
import "./page.css";
import { prisma } from "@/lib/prisma";
import { getLegalDocuments } from "@/app/actions/legal-documents";

export default async function SettingsPage() {
    // const pages = await prisma.sitePage.findMany({});

    const [settings, legalDocs, allPages] = await Promise.all([
        getSiteSettings(),
        getLegalDocuments(),
        // getAllPagesForSelect(),  
        prisma.sitePage.findMany({})
    ]);


    // const settings = await getSiteSettings();

    if (!settings.data) return <div className="settings-page-wrapper">Error! Settings.data Not Provided!</div>

    return (
        <div className="settings-page-wrapper" style={{ backgroundColor: '#f9fafb' }}>
            <SettingsForm allPages={allPages} initialSettings={settings.data} documents={legalDocs} />
        </div>
    );
}