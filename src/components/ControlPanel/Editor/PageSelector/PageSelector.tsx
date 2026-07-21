'use client';

import { Page } from "@/app/controlpanel/(protected)/editor/page";
import "./PageSelector.css";

export default function PageSelector({ pages, onSelect, onCreate, onDelete, activePage }: {
    pages: Page[];
    activePage: number | null;
    onSelect: (pageId: number) => void;
    onCreate: () => void;
    onDelete: (pageId: number) => void;
}) {
    return (
        <div className="editor-page-selector">
            <h3 className="editor-page-selector__title">Страница:</h3>
            <div className="editor-page-selector__elements">
                {pages.map((p, idx) => (
                    <div className={`page-selector-element ${activePage === p.id ? 'selected' : ''}`} key={p.id} onClick={() => onSelect(p.id)}>
                        <div className="page-selector-element__left">
                            <span className="page-selector-element__index">{idx + 1}</span>
                            <span className="page-selector-element__name">{p.name}</span>
                        </div>
                        <div className="page-selector-element__right">
                            <span className="page-selector-element__url">{p.slug}</span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="editor-page-selector__button" onClick={() => onCreate()}>[+] Создать страницу</button>
        </div>
    )
}