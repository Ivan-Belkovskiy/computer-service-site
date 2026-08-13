import { prisma } from "@/lib/prisma";
import SetSectionData from "@/components/ControlPanel/SetSectionData";
import CustomSectionEditor from "@/components/ControlPanel/Editor/CustomSectionEditor/CustomSectionEditor";
import "./page.css";

export default async function CustomSectionEditorPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const resolved = await params;
    const id = parseInt(resolved.id, 10);

    const sectionData = await prisma.custom_sections.findUnique({
        where: { id }
    });

    if (!sectionData) {
        return <div>Секция не найдена</div>;
    }

    return (
        <div className="custom-section-editor-page">
            <SetSectionData data={{
                id: sectionData.id,
                title: sectionData.name,
            }} />
            <CustomSectionEditor sectionData={sectionData} />
        </div>
    );
}