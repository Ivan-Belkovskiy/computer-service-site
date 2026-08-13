'use client';

import Link from "next/link";
import { CustomSection } from "@/app/controlpanel/(protected)/editor/page";
import "./CustomSectionData.css";

interface CustomSectionDataProps {
    section: CustomSection | null;
    onDelete: (id: number) => void;
}

export default function CustomSectionData({ section, onDelete }: CustomSectionDataProps) {
    if (!section) {
        return (
            <div className="editor-custom-section-data empty">
                <p>Выберите секцию из списка слева или создайте новую</p>
            </div>
        );
    }

    const schemaFields = Array.isArray(section.props) ? section.props : [];

    return (
        <div className="editor-custom-section-data">
            <div className="editor-custom-section-data__header">
                <h3>{section.name}</h3>
                <span className="editor-custom-section-data__id">(ID: #{section.id})</span>
            </div>

            {/* <div className="site-editor__block">
                <h4>Основные действия</h4>
                <div className="editor-custom-section-data__actions">
                    <Link
                        href={`/controlpanel/editor/custom-sections/${section.id}`}
                        className="site-editor__button primary-btn"
                    >
                        Открыть редактор блоков
                    </Link>
                </div>
            </div> */}

            <div className="editor-custom-section-data__block">
                <h4>Поля секции (Props):</h4>
                {schemaFields.length === 0 ? (
                    <p className="text-muted">У этой секции нет настраиваемых полей</p>
                ) : (
                    <ul className="custom-section-data__props-list">
                        {schemaFields.map((field: any, idx: number) => (
                            <li key={field.id || idx} className="custom-section-data__prop-item">
                                <strong>{field.label || field.key}</strong> 
                                <code>({field.type})</code> — 
                                <span>ключ: <code>{field.key}</code></span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="editor-custom-section-data__block">
                <Link
                        href={`/controlpanel/editor/custom-sections/${section.id}`}
                        className="editor-custom-section-data__button open-block-editor-btn"
                    >
                        Открыть редактор блоков
                    </Link>
                <button
                    className="editor-custom-section-data__button delete-section-button"
                    onClick={() => onDelete(section.id)}
                >
                    Удалить секцию
                </button>
            </div>
        </div>
    );
}