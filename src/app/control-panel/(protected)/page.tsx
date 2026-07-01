
// export async function generateMetadata(): Promise<Metadata> {
//   const meta = await loadMetadata();
//   return {
//     title: `Панель Управления | ${meta?.data?.title || "Computer-Service-Site"}`,
//     description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
//   };
// }

import MainInfoEditor from "@/components/ControlPanel/MainInfoEditor/MainInfoEditor";
import { Metadata } from "next";
import { loadMetadata } from "../../actions";

export default function ControlPanelPage() {
    return (
        <div className="control-panel">
            <MainInfoEditor />
            {/* <ControlPanel /> */}
        </div>
    )
}