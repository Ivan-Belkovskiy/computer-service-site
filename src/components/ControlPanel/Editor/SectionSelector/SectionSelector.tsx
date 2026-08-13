'use client';

import { CustomSection, PageSection } from "@/app/controlpanel/(protected)/editor/page";
import "./SectionSelector.css";
import { useState } from "react";
import { updateSectionProps } from "@/app/actions/editor";
import { useRouter } from "next/navigation";

interface SectionSelectorProps {
    sections?: PageSection[];
    customSections?: CustomSection[];
    isPageSelected: boolean;
    onMove: (currentIndex: number, direction: 'up' | 'down') => void;
    onDelete: (sectionId: number) => void;
}

export default function SectionSelector({
    sections = [],
    customSections = [],
    isPageSelected,
    onMove,
    onDelete
}: SectionSelectorProps) {
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const router = useRouter();

    const handleSaveProps = async (e: React.FormEvent<HTMLFormElement>, sectionId: number, type: string) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        const updatedProps: Record<string, any> = {};

        if (type === 'SERVICES') {
            updatedProps.title = formData.get('title') as string;
            updatedProps.limit = Number(formData.get('limit'));
            updatedProps.showCategories = formData.get('showCategories') === 'on';
            updatedProps.globalPadding = Number(formData.get('globalPadding'));
        }
        
        // if (type === 'HERO') {
        //     updatedProps.title = formData.get('title') as string;
        // }

        const result = await updateSectionProps(sectionId, updatedProps);
        
        if (result.success) {
            router.refresh();
            alert("Настройки секции успешно сохранены!");
            setSelectedSectionId(null);
        } else {
            alert("Произошла ошибка: " + result.error);
        }
        
        setIsSaving(false);
    };

    return (
        <div className="editor-section-selector">
            <div className="editor-section-selector__elements">
                {!isPageSelected ? (
                    <div className="section-selector__info">← Выберите страницу для редактирования</div>
                ) : sections.length === 0 ? (
                    <div className="section-selector__info">На этой странице пока нет секций.</div>
                ) : (
                    sections.map((s, idx) => {
                        const isEditing = selectedSectionId === s.id;
                        const currentProps = (s.props as Record<string, any>) || {};

                        const customSectionData = customSections.find(cs => cs.id === s.custom_section_id);

                        return (
                            <div className={`section-selector-element ${isEditing ? 'active' : ''}`} key={s.id}>
                                <div className="section-selector-element__top">
                                    <div className="section-selector-element__left">
                                        <span className="section-selector-element__index">{idx + 1}</span>
                                        <span className="section-selector-element__name">
                                            {s.type === 'CUSTOM' ? (
                                                customSectionData?.name
                                            ) : s.type === 'HERO' ? `${s.name} (Hero Section)` : s.name}
                                        </span>
                                    </div>
                                    <div className="section-selector-element__right">
                                        <div className="section-selector-element__buttons">
                                            <button
                                                className={`section-selector-element__button ${isEditing ? 'btn-active' : ''}`}
                                                onClick={() => setSelectedSectionId(isEditing ? null : s.id)}
                                            >
                                                {isEditing ? "Закрыть" : "Редактировать"}
                                            </button>
                                            <button
                                                className="section-selector-element__button"
                                                disabled={idx === 0}
                                                onClick={() => onMove(idx, 'up')}
                                            >▲</button>
                                            <button
                                                className="section-selector-element__button"
                                                disabled={idx === sections.length - 1}
                                                onClick={() => onMove(idx, 'down')}
                                            >▼</button>
                                            <button
                                                className="section-selector-element__button delete-section-btn"
                                                onClick={() => onDelete(s.id)}
                                            >⨉</button>
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="section-selector-element__bottom">
                                        <form onSubmit={(e) => handleSaveProps(e, s.id, s.type)} className="section-editor-form">
                                            <h4>Настройки секции "{(s.type === 'CUSTOM' ? customSectionData?.name : s.name)}":</h4>
                                            
                                            {s.type === 'SERVICES' && (
                                                <div className="section-editor-form__column">
                                                    <div className="section-editor-form__block">
                                                        <span>Заголовок секции:</span>
                                                        <input 
                                                            type="text" 
                                                            name="title" 
                                                            key={`${s.id}-title-${currentProps.title || 'default'}`}
                                                            defaultValue={currentProps.title || "Наши услуги"} 
                                                        />
                                                    </div>
                                                    <div className="section-editor-form__block">
                                                        <span>Лимит отображения услуг:</span>
                                                        <input 
                                                            type="number" 
                                                            name="limit" 
                                                            key={`${s.id}-limit-${currentProps.limit || 3}`}
                                                            defaultValue={currentProps.limit || 3} 
                                                        />
                                                    </div>
                                                    <div className="section-editor-form__block">
                                                        <span>Глобальный отступ (px):</span>
                                                        <input 
                                                            type="number" 
                                                            name="globalPadding" 
                                                            key={`${s.id}-padding-${currentProps.globalPadding || 25}`}
                                                            defaultValue={currentProps.globalPadding || 25} 
                                                        />
                                                    </div>
                                                    <div className="section-editor-form__block">
                                                        <span>Разделить по категориям:</span>
                                                        <input 
                                                            type="checkbox" 
                                                            name="showCategories" 
                                                            key={`${s.id}-categories-${currentProps.showCategories ?? true}`}
                                                            defaultChecked={currentProps.showCategories ?? true} 
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* {s.type === 'HERO' && (
                                                <div className="section-editor-form__column">
                                                    <div className="section-editor-form__block">
                                                        <span>Главный текст (Title):</span>
                                                        <input 
                                                            type="text" 
                                                            name="title" 
                                                            key={`${s.id}-hero-title-${currentProps.title || 'default'}`}
                                                            defaultValue={currentProps.title || ""} 
                                                        />
                                                    </div>
                                                </div>
                                            )} */}

                                            {s.type !== 'SERVICES' /*&& s.type !== 'HERO'*/ && (
                                                <p className="no-props-info">Для этой секции пока нет настраиваемых пропсов.</p>
                                            )}

                                            {(s.type === 'SERVICES') && <button type="submit" disabled={isSaving} className="section-save-btn">
                                                {isSaving ? "Сохранение..." : "Сохранить изменения"}
                                            </button>}
                                        </form>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}