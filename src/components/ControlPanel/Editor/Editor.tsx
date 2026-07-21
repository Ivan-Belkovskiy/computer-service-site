'use client';

import { Page, PageSection } from "@/app/controlpanel/(protected)/editor/page";
import "./Editor.css";
import PageSelector from "./PageSelector/PageSelector";
import SectionSelector from "./SectionSelector/SectionSelector";
import { useState, useEffect } from "react";
import { swapSectionsOrder, addSectionToPage, deleteSection, updatePage, deletePage } from "@/app/actions/editor";
import NewPageModal from "./NewPageModal/NewPageModal";

const SERVICES_TYPE_TRANSLATIONS: Record<string, string> = {
    "HERO": "Основная Секция (Hero Section)",
    "SERVICES": "Наши Услуги",
    "FEATURES": "Преимущества Сервиса",
    "CONTACTS": "Контактная Информация"
};

export default function Editor({ pages, sections: initialSections }: { pages: Page[]; sections: PageSection[]; }) {
    const [currentPageId, setCurrentPageId] = useState<number | null>(null);

    const [allSections, setAllSections] = useState<PageSection[]>(initialSections);

    const [defaultSectionType, setDefaultSectionType] = useState("HERO");

    const [isModalOpened, setModalOpened] = useState(false);

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

    const handleAddStandardSection = async (type: string, readableName: string) => {
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

    const handleDeletePage = async (id: number) => {
        const result = window.confirm('Удалить страницу? Это действие отменить нельзя!');

        if (result) {
            const r = await deletePage(id);

            if (r.success) {
                setCurrentPageId(null);
            }
        }
    }

    const updatePageDisplayInNavigation = async (id: number, value: boolean) => {
        const result = await updatePage(id, {
            displayInNavigation: value,
        });
    }

    const currentPage = pages.find(p => p.id === currentPageId);

    return (
        <div className="site-editor">
            <PageSelector
                activePage={currentPageId}
                pages={pages}
                onSelect={(id) => setCurrentPageId(id)}
                onCreate={() => setModalOpened(true)}
                onDelete={handleDeletePage}
            />

            <div className="editor-main-panel">
                <SectionSelector
                    sections={filteredSections}
                    isPageSelected={currentPageId !== null}
                    onMove={handleMoveSection}
                    onDelete={handleDeleteSection}
                />

                {currentPageId && (
                    <>
                        <div className="site-editor__block">
                            <h4>Добавить секцию:</h4>
                            <div className="site-editor__field">
                                <select
                                    className="site-editor__select"
                                    value={defaultSectionType}
                                    onChange={(e) => setDefaultSectionType(e.target.value)}
                                >
                                    <option value="HERO">Основная Секция (Hero Section)</option>
                                    <option value="SERVICES">Наши Услуги</option>
                                    <option value="FEATURES">Преимущества Сервиса</option>
                                    <option value="CONTACTS">Контактная Информация</option>
                                </select>
                                <button className="site-editor__button" onClick={() => handleAddStandardSection(defaultSectionType, SERVICES_TYPE_TRANSLATIONS[defaultSectionType])}>Добавить</button>
                            </div>
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
                                <span className="site-editor__label">Отображать в меню навигации:</span>
                                <input
                                    type="checkbox"
                                    className="site-editor__checkbox"
                                    checked={currentPage?.displayInNavigation ? true : false}
                                    onChange={(e) => updatePageDisplayInNavigation(currentPageId, e.target.checked)}
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

                        </div>

                        <button className="site-editor__button delete-page-button" onClick={() => handleDeletePage(currentPageId)}>Удалить страницу</button>
                    </>
                )}
            </div>
            {/* {(isModalOpened) && ( */}
            <NewPageModal isOpened={isModalOpened} onClose={() => setModalOpened(false)} onSubmit={() => setModalOpened(false)} />
            {/* )} */}
        </div>
    );
}