import { prisma } from "@/lib/prisma";
import "./page.css";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import PageSelector from "@/components/ControlPanel/Editor/PageSelector/PageSelector";
import SectionSelector from "@/components/ControlPanel/Editor/SectionSelector/SectionSelector";
import Editor, { EditorMode } from "@/components/ControlPanel/Editor/Editor";

export type Page = Prisma.site_pagesGetPayload<{}>;
export type CustomSection = Prisma.custom_sectionsGetPayload<{}>;
export type PageSection = Prisma.page_sectionsGetPayload<{}>;

export default async function SiteEditorPage({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

    const params = await searchParams;

    const initialMode = (typeof params.initialMode === 'string') ? params.initialMode as EditorMode : undefined;
    const initialCustomSectionId = (typeof params.selectedCustomSection === 'string') ? parseInt(params.selectedCustomSection, 10) : undefined;
    // const pages = await prisma.site_pages.findMany({});
    // const sections = await prisma.page_sections.findMany({});

    const [
        pages,
        sections,
        customSections,
    ] = await Promise.all([
        await prisma.site_pages.findMany({}),
        await prisma.page_sections.findMany({}),
        await prisma.custom_sections.findMany({})
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