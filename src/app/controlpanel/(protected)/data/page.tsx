
// export async function generateMetadata(): Promise<Metadata> {
//     const meta = await loadMetadata();
//     return {
//         title: `Панель Управления | ${meta?.data?.title || "Computer-Service-Site"}`,
//         description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
//     };
// }

import { loadMetadata } from "@/app/actions";
import DataEditor from "@/components/ControlPanel/DataEditor/DataEditor";
import { Metadata } from "next";

export default function ControlPanelDataPage() {
    return (
        <div className="control-panel-data-page">
            <DataEditor />
        </div>
    )
}