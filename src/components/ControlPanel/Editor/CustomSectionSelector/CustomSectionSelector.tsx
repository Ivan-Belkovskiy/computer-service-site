'use client';

import { CustomSection, Page } from "@/app/controlpanel/(protected)/editor/page";
import "./CustomSectionSelector.css";

export default function CustomSectionSelector({ sections, onSelect, onCreate, onDelete, activeSection }: {
    sections: CustomSection[];
    activeSection: number | null;
    onSelect: (pageId: number) => void;
    onCreate: () => void;
    onDelete: (pageId: number) => void;
}) {
    return (
        <div className="editor-custom-section-selector">
            <h3 className="editor-custom-section-selector__title">Мои секции:</h3>
            <div className="editor-custom-section-selector__elements">
                {sections.map((p, idx) => (
                    <div className={`custom-section-selector-element ${activeSection === p.id ? 'selected' : ''}`} key={p.id} onClick={() => onSelect(p.id)}>
                        <div className="custom-section-selector-element__left">
                            <span className="custom-section-selector-element__index">{idx + 1}</span>
                            <span className="custom-section-selector-element__name">{p.name}</span>
                        </div>
                        {/* <div className="custom-section-selector-element__right">
                            <span className="custom-section-selector-element__url">{p.slug}</span>
                        </div> */}
                    </div>
                ))}
            </div>
            <button className="editor-custom-section-selector__button" onClick={() => onCreate()}>[+] Добавить</button>
        </div>
    )
}