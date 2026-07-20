import { prisma } from "@/lib/prisma";
import "./page.css";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import PageSelector from "@/components/ControlPanel/Editor/PageSelector/PageSelector";
import SectionSelector from "@/components/ControlPanel/Editor/SectionSelector/SectionSelector";
import Editor from "@/components/ControlPanel/Editor/Editor";

export type Page = Prisma.site_pagesGetPayload<{}>;
export type PageSection = Prisma.page_sectionsGetPayload<{}>;

export default async function SiteEditorPage() {

    const pages = await prisma.site_pages.findMany({});
    const sections = await prisma.page_sections.findMany({});


    return (
        <div className="editor-page">
            <header className="editor-page__header">
                <h2>Редактор сайта</h2>
                {/* {(filterClientName) && <Link href="/controlpanel/orders" className="editor-page__button">Показать все заявки</Link>} */}
            </header>

            <div className="editor-page__content">
                <Editor pages={pages} sections={sections} />
            </div>

            {/* <div className="editor-page-selector">

            </div> */}

        </div>
    );
}