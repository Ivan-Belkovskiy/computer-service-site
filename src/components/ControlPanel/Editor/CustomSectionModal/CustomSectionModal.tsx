'use client';

import { useState } from 'react';
import { PropSchemaField, PropType } from '@/types/sections';
import { createCustomSection } from '@/app/actions/custom-sections';

import "./CustomSectionModal.css";

type InternalPropSchemaField = PropSchemaField & { id: string };

export function CustomSectionModal({ isOpened, onClose }: { isOpened?: boolean; onClose?: () => void }) {
    const [sectionName, setSectionName] = useState('');
    const [fields, setFields] = useState<InternalPropSchemaField[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const addField = () => {
        const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : `id_${Date.now()}_${Math.random()}`;

        const newField: InternalPropSchemaField = {
            id: uniqueId, 
            key: `field_${Date.now()}`,
            label: 'Новое поле',
            type: 'text',
            required: false,
        };
        setFields([...fields, newField]);
    };

    const updateField = (index: number, prop: keyof PropSchemaField, value: any) => {
        setFields(p => p.map((field, i) => i === index ? {
            ...field,
            [prop]: value
        } : field));
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!sectionName.trim()) return alert('Укажите название шаблона');

        setIsSaving(true);
        
        const cleanFields: PropSchemaField[] = fields.map(({ id, ...field }) => field);

        const res = await createCustomSection(sectionName, cleanFields);
        setIsSaving(false);

        if (res.success) {
            alert('Шаблон секции успешно создан!');
            setSectionName('');
            setFields([]);
            if (onClose) onClose();
        } else {
            alert(res.error);
        }
    };

    return (
        <div className={`custom-section-modal__overlay ${isOpened ? 'opened' : ''}`}>
            <div className="custom-section-modal">
                <button className="custom-section-modal__button close-btn" onClick={onClose}>⨉</button>
                <h1 className="custom-section-modal__title">
                    Создание пользовательской секции
                </h1>

                <div className="custom-section-modal__block">
                    <span className="custom-section-modal__label">
                        Название секции:
                    </span>
                    <input
                        type="text"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        className="custom-section-modal__input"
                    />
                </div>

                <div className="custom-section-modal__block flex-col">
                    <span className="custom-section-modal__props-label">Поля секции</span>

                    <div className="custom-section-modal__props">
                        {fields.map((field, idx) => (
                            <div key={field.id} className="custom-section-modal__prop">
                                <div className="custom-section-modal__field">
                                    <span className="custom-section-modal__label">Название:</span>
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => updateField(idx, 'label', e.target.value)}
                                        placeholder="Название поля (Label)"
                                        className="custom-section-modal__input"
                                    />
                                </div>

                                <div className="custom-section-modal__field">
                                    <span className="custom-section-modal__label">JSON-ключ:</span>
                                    <input
                                        type="text"
                                        value={field.key}
                                        onChange={(e) => updateField(idx, 'key', e.target.value)}
                                        className="custom-section-modal__input"
                                    />
                                </div>

                                <div className="custom-section-modal__field">
                                    <span className="custom-section-modal__label">Тип данных:</span>
                                    <select
                                        value={field.type}
                                        onChange={(e) => updateField(idx, 'type', e.target.value as PropType)}
                                        className="custom-section-modal__input"
                                    >
                                        <option value="text">Текст (строка)</option>
                                        <option value="textarea">Текст (многострочный)</option>
                                        <option value="image">Изображение</option>
                                        <option value="boolean">Переключатель (Да/Нет)</option>
                                        <option value="number">Число</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeField(idx)}
                                    className="custom-section-modal__button"
                                >
                                    Удалить поле
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={addField}
                    className="custom-section-modal__button"
                >
                    + Добавить поле
                </button>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="custom-section-modal__button save-section-btn"
                >
                    {isSaving ? 'Сохранение...' : 'Сохранить секцию'}
                </button>
            </div>
        </div>
    );
}