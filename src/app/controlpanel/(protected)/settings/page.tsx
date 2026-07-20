import SettingsForm from "./SettingsForm";
import { getSiteSettings } from "@/app/actions";
import "./page.css";

export default async function SettingsPage() {
    // return (
    //     <div className="">НАСТРОЙКИ САЙТА!</div>
    // )
    const settings = await getSiteSettings();

    if (!settings.data) return <div className="settings-page-wrapper">Error! Settings.data Not Provided!</div>

    return (
        <div className="settings-page-wrapper" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '24px' }}>
            <SettingsForm initialSettings={settings.data} />
        </div>
    );
}