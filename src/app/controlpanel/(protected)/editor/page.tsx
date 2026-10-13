import { prisma } from "@/lib/prisma";
import "./page.css";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import PageSelector from "@/components/ControlPanel/Editor/PageSelector/PageSelector";
import SectionSelector from "@/components/ControlPanel/Editor/SectionSelector/SectionSelector";
import Editor, { EditorMode } from "@/components/ControlPanel/Editor/Editor";

export type Page = Prisma.SitePageGetPayload<{}>;
export type CustomSection = Prisma.CustomSectionGetPayload<{}>;
export type PageSection = Prisma.PageSectionGetPayload<{}>;

export default async function SiteEditorPage({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

    const params = await searchParams;

    const initialMode = (typeof params.initialMode === 'string') ? params.initialMode as EditorMode : undefined;
    const initialCustomSectionId = (typeof params.selectedCustomSection === 'string') ? parseInt(params.selectedCustomSection, 10) : undefined;
    // const pages = await prisma.sitePage.findMany({});
    // const sections = await prisma.pageSection.findMany({});

    const [
        pages,
        sections,
        customSections,
    ] = await Promise.all([
        await prisma.sitePage.findMany({}),
        await prisma.pageSection.findMany({}),
        await prisma.customSection.findMany({})
    ]);


    return (
        <div className="editor-page">


            <Editor
                pages={pages}
                sections={sections}
                customSections={customSections}
                initialMode={initialMode}
                initialCustomSectionId={initialCustomSectionId}
            />


            {/* <div className="editor-page-selector">

            </div> */}

        </div>
    );
}