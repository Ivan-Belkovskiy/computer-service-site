'use client';

import { CustomSection, Page, PageSection } from "@/app/controlpanel/(protected)/editor/page";
import "./Editor.css";
import PageSelector from "./PageSelector/PageSelector";
import SectionSelector from "./SectionSelector/SectionSelector";
import { useState, useEffect } from "react";
import { swapSectionsOrder, addSectionToPage, deleteSection, updatePage, deletePage } from "@/app/actions/editor";
import NewPageModal from "./NewPageModal/NewPageModal";
import CustomSectionSelector from "./CustomSectionSelector/CustomSectionSelector";
import { CustomSectionModal } from "./CustomSectionModal/CustomSectionModal";
import CustomSectionData from "./CustomSectionData/CustomSectionData";
import CustomSelect, { CustomSelectElement } from "./CustomSelect/CustomSelect";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SERVICES_TYPE_TRANSLATIONS: Record<string, string> = {
    "HERO": "Основная Секция (Hero Section)",
    "SERVICES": "Наши Услуги",
    "FEATURES": "Преимущества Сервиса",
    "CONTACTS": "Контактная Информация"
};

export type EditorMode = 'main' | 'custom-sections';

export default function Editor({
    pages,
    sections: initialSections,
    initialMode = 'main',
    initialCustomSectionId,

    customSections,
}: {
    pages: Page[];
    sections: PageSection[];
    initialMode?: EditorMode
    initialCustomSectionId?: number;

    customSections: CustomSection[];
}) {

    const [editorMode, setEditorMode] = useState<EditorMode>('main');

    const [currentPageId, setCurrentPageId] = useState<number | null>(null);

    const [currentCustomSectionId, setCurrentCustomSectionId] = useState<number | null>(null);

    const [allSections, setAllSections] = useState<PageSection[]>(initialSections);

    const [defaultSectionType, setDefaultSectionType] = useState<string | null>("HERO");
    const [customSectionToAdd, setCustomSectionToAdd] = useState<number | null>(null);

    const [selectKey, setSelectKey] = useState('Default-Hero-Section');

    const [isModalOpened, setModalOpened] = useState(false);

    const [isCustomSectionModalOpened, setCustomSectionModalOpened] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setEditorMode(initialMode || "main");
    }, [initialMode]);

    useEffect(() => {
        setCurrentCustomSectionId(initialCustomSectionId || null);
    }, [initialCustomSectionId]);

    useEffect(() => {
        setAllSections(initialSections);
    }, [initialSections]);

    const filteredSections = allSections
        .filter(s => s.page_id === currentPageId)
        .sort((a, b) => a.display_order - b.display_order);

    const handleMoveSection = async (currentIndex: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= filteredSections.length) return;

        const currentSec = filteredSections[currentIndex];
        const targetSec = filteredSections[targetIndex];

        setAllSections(prev => prev.map(s => {
            if (s.id === currentSec.id) return { ...s, display_order: targetSec.display_order };
            if (s.id === targetSec.id) return { ...s, display_order: currentSec.display_order };
            return s;
        }));

        const result = await swapSectionsOrder(
            currentSec.id, targetSec.display_order,
            targetSec.id, currentSec.display_order
        );

        if (!result.success) {
            setAllSections(initialSections);
            alert("Не удалось сохранить порядок в базе данных.");
        }
    };

    const handleDeleteSection = async (id: number) => {
        setAllSections(prev => prev.filter(s => s.id !== id));

        const result = await deleteSection(id);

        if (!result.success) {
            setAllSections(initialSections);
            alert("Не удалось сохранить данные в базе данных.");
        }
    }

    const handleAddDefaultSection = async (type: string, readableName: string) => {
        if (!currentPageId) return;

        const nextOrder = filteredSections.length > 0
            ? Math.max(...filteredSections.map(s => s.display_order)) + 1
            : 0;

        const result = await addSectionToPage({
            pageId: currentPageId,
            type,
            name: readableName,
            nextOrder
        });

        if (result.success && result.data) {
            setAllSections(prev => [...prev, result.data as PageSection]);
        } else {
            alert("Не удалось добавить секцию");
        }
    };

    const handleAddCustomSection = async (id: number, name?: string) => {
        if (!currentPageId) return;

        const nextOrder = filteredSections.length > 0
            ? Math.max(...filteredSections.map(s => s.display_order)) + 1
            : 0;

        const result = await addSectionToPage({
            pageId: currentPageId,
            type: "CUSTOM",
            // name,
            customSectionId: id,
            nextOrder
        });

        if (result.success && result.data) {
            setAllSections(prev => [...prev, result.data as PageSection]);
        } else {
            alert("Не удалось добавить секцию");
        }
    }

    const handleDeletePage = async (id: number) => {
        const result = window.confirm('Удалить страницу? Это действие отменить нельзя!');

        if (result) {
            const r = await deletePage(id);

            if (r.success) {
                setCurrentPageId(null);
            }
        }
    }

    const currentPage = pages.find(p => p.id === currentPageId);

    const [pageData, setPageData] = useState<Partial<Page> | null>(null);
    const [isDataSaving, setDataSaving] = useState(false);

    useEffect(() => {
        setPageData(currentPage || null);
    }, [currentPageId]);

    const updatePageData = (key: string, value: string | number | boolean) => {
        setPageData(p => ({
            ...p,
            [key]: value,
        }));
        // const result = await updatePage(pageId, {
        //     [key]: value,
        // });
    }

    const savePageData = async (pageId: number) => {
        if (!pageData) return;
        setDataSaving(true);
        const result = await updatePage(pageId, {
            name: pageData.name,
            slug: pageData.slug,
            displayInNavigation: pageData.displayInNavigation,
        });
        setDataSaving(false);
    }


    const currentCustomSection = customSections.find(s => s.id === currentCustomSectionId);


    const customSectionOptions: CustomSelectElement<{
        type: string;
        section?: string;
        customSectionId?: number;
    }>[] = customSections.map(cs => ({
        type: "button",
        label: cs.name,
        key: cs.id,
        value: {
            type: "CUSTOM",
            customSectionId: cs.id,
        }
        // value: cs.id,
    }));

    return (

        <>
            <header className="editor-page__header">
                <h2>{editorMode === 'main' ? "Редактор сайта" : "Редактор пользовательских секций"}</h2>
                {(editorMode === 'custom-sections') && <Link href={"/controlpanel/editor/"} className="site-editor__button" /*onClick={() => {
                    
                    // setEditorMode('main');
                }}*/>↩ Назад к редактору страниц</Link>}
            </header>
            <div className="editor-page__content">
                <div className="site-editor">

                    {(editorMode === 'main') && <div className="editor-main-panel">
                        <PageSelector
                            activePage={currentPageId}
                            pages={pages}
                            onSelect={(id) => setCurrentPageId(id)}
                            onCreate={() => setModalOpened(true)}
                            onDelete={handleDeletePage}
                        />

                        <div className="editor-main-panel__column">
                            <SectionSelector
                                sections={filteredSections}
                                customSections={customSections}
                                isPageSelected={currentPageId !== null}
                                onMove={handleMoveSection}
                                onDelete={handleDeleteSection}
                            />

                            {currentPageId && (
                                <>
                                    <div className="site-editor__block">
                                        <h4>Добавить секцию:</h4>
                                        <div className="site-editor__field">
                                            <CustomSelect<{
                                                type: string;
                                                section?: string;
                                                customSectionId?: number;
                                            }>
                                                className="site-editor__select"
                                                value={selectKey}
                                                onSelect={(val, key) => {
                                                    if (val.type === 'DEFAULT' && val.section) {
                                                        setDefaultSectionType(val.section);
                                                        setCustomSectionToAdd(null);
                                                    } else if (val.type === 'CUSTOM' && val.customSectionId) {
                                                        setDefaultSectionType(null);
                                                        setCustomSectionToAdd(val.customSectionId);
                                                    }
                                                    setSelectKey(key as string);
                                                    
                                                }}
                                                elements={[
                                                    {
                                                        type: "label",
                                                        label: "Предустановленные секции",
                                                        key: 'label01',
                                                    },
                                                    {
                                                        type: "button",
                                                        label: "Основная Секция (Hero Section)",
                                                        value: {
                                                            type: "DEFAULT",
                                                            section: "HERO",
                                                        },
                                                        key: "Default-Hero-Section",
                                                        // onClick: () => setDefaultSectionType('HERO'),
                                                    },
                                                    {
                                                        type: "button",
                                                        label: "Наши Услуги",
                                                        value: {
                                                            type: "DEFAULT",
                                                            section: "SERVICES",
                                                        },
                                                        key: "Default-Services-Section",
                                                        // onClick: () => setDefaultSectionType('SERVICES'),
                                                    },
                                                    {
                                                        type: "button",
                                                        label: "Преимущества Сервиса",
                                                        value: {
                                                            type: "DEFAULT",
                                                            section: "FEATURES",
                                                        },
                                                        key: "Default-Features-Section",
                                                        // onClick: () => setDefaultSectionType('FEATURES'),
                                                    },
                                                    {
                                                        type: "button",
                                                        label: "Контактная Информация",
                                                        value: {
                                                            type: "DEFAULT",
                                                            section: "CONTACTS",
                                                        },
                                                        key: "Default-Contacts-Section",
                                                        // onClick: () => setDefaultSectionType('CONTACTS'),
                                                    },
                                                    {
                                                        type: "label",
                                                        label: "Созданные секции",
                                                        key: "label02",
                                                    },

                                                    ...customSectionOptions,


                                                ]}
                                            />
                                            {/* <select
                                                className="site-editor__select"
                                                value={defaultSectionType}
                                                onChange={(e) => setDefaultSectionType(e.target.value)}
                                            >
                                                <option value="HERO">Основная Секция (Hero Section)</option>
                                                <option value="SERVICES">Наши Услуги</option>
                                                <option value="FEATURES">Преимущества Сервиса</option>
                                                <option value="CONTACTS">Контактная Информация</option>
                                                {customSections.length > 0 && (
                                                    <>
                                                        {customSections.map(cs => (
                                                            <option value={cs.id}>{cs.name}</option>
                                                        ))}
                                                    </>
                                                )}
                                            </select> */}
                                            <button className="site-editor__button" onClick={() => {
                                                if (defaultSectionType) {
                                                    handleAddDefaultSection(defaultSectionType, SERVICES_TYPE_TRANSLATIONS[defaultSectionType]);
                                                } else if (customSectionToAdd) {
                                                    handleAddCustomSection(customSectionToAdd);
                                                }
                                            }}>Добавить</button>

                                        </div>
                                        <button
                                            className="site-editor__button save-page-data-btn"
                                            onClick={() => {
                                                if (
                                                    confirm('Перейти в редактор пользовательских секций? Сохраните данные страниц перед переходом!')
                                                ) {
                                                    router.push("/controlpanel/editor?initialMode=custom-sections");
                                                    // setEditorMode('custom-sections');
                                                }
                                            }}
                                            disabled={isDataSaving}
                                        >Открыть редактор пользовательских секций</button>
                                        {/* <div className="flex gap-2 mt-2">
                            <button onClick={() => handleAddStandardSection('SERVICES', 'Наши услуги')} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                                + Список Услуг
                            </button>
                            <button onClick={() => handleAddStandardSection('FEATURES', 'Преимущества')} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                                + Преимущества
                            </button>
                        </div> */}
                                    </div>

                                    <div className="site-editor__block">
                                        <h4>О странице:</h4>
                                        <div className="site-editor__field">
                                            <span className="site-editor__label">Название:</span>
                                            <input
                                                type="text"
                                                className="site-editor__input"
                                                value={pageData?.name || ""}
                                                onChange={(e) => updatePageData('name', e.target.value)}
                                            />
                                        </div>
                                        <div className="site-editor__field">
                                            <span className="site-editor__label">URL:</span>
                                            <input
                                                type="text"
                                                className="site-editor__input"
                                                value={pageData?.slug || ""}
                                                disabled={currentPage?.slug === '/'}
                                                onChange={(e) => updatePageData('slug', e.target.value)}
                                            />
                                        </div>
                                        <div className="site-editor__field">
                                            <span className="site-editor__label">Отображать в меню навигации:</span>
                                            <input
                                                type="checkbox"
                                                className="site-editor__checkbox"
                                                disabled={currentPage?.slug === '/'}
                                                checked={pageData?.displayInNavigation ? true : false}
                                                onChange={(e) => updatePageData('displayInNavigation', e.target.checked)}
                                            />
                                        </div>
                                        {/* <select
                                className="site-editor__select"
                                value={defaultSectionType}
                                onChange={(e) => setDefaultSectionType(e.target.value)}
                            >
                                <option value="HERO">Основная Секция (Hero Section)</option>
                                <option value="SERVICES">Наши Услуги</option>
                                <option value="FEATURES">Преимущества Сервиса</option>
                                <option value="CONTACTS">Контактная Информация</option>
                            </select> */}
                                        {/* <button className="site-editor__button" onClick={() => handleAddStandardSection(defaultSectionType, SERVICES_TYPE_TRANSLATIONS[defaultSectionType])}>Добавить</button> */}

                                        <button
                                            className="site-editor__button save-page-data-btn"
                                            onClick={() => savePageData(currentPageId)}
                                            disabled={isDataSaving}
                                        >{isDataSaving ? "Сохранение..." : "Сохранить данные"}</button>

                                    </div>

                                    {(currentPage?.slug !== '/') && <button className="site-editor__button delete-page-button" onClick={() => handleDeletePage(currentPageId)}>Удалить страницу</button>}
                                </>
                            )}
                        </div>
                    </div>}

                    {(editorMode === 'custom-sections') && <div className="editor-section-panel">
                        <CustomSectionSelector
                            sections={customSections}

                            activeSection={currentCustomSectionId}
                            onCreate={() => setCustomSectionModalOpened(true)}
                            onSelect={(v) => setCurrentCustomSectionId(v)}
                            onDelete={() => 0}
                        />

                        {(currentCustomSection) && <CustomSectionData
                            section={currentCustomSection}
                            onDelete={() => 1}
                        />}
                    </div>}
                    {/* {(isModalOpened) && ( */}
                    <NewPageModal isOpened={isModalOpened} onClose={() => setModalOpened(false)} onSubmit={() => setModalOpened(false)} />
                    <CustomSectionModal isOpened={isCustomSectionModalOpened} onClose={() => setCustomSectionModalOpened(false)} />
                    {/* )} */}
                </div>
            </div>
        </>

    );
}