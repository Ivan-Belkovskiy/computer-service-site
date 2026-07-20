'use client';

import { useState, useRef } from "react";
import { transliterate } from "@/utils/transliterator";
import { useActionState, startTransition } from "react";
import { createService, ServiceActionState, deleteService } from "@/app/controlpanel/(protected)/services/actions";
import Link from "next/link";
import "./ServiceManagementForm.css";
import { useRouter } from "next/navigation";
import { Service } from "@/types/types";

export default function ServiceManagementForm({ uiAction = "create", actionFn, editingService }: {
    uiAction?: "create" | "edit",
    editingService?: Service;
    actionFn: (state: any, payload: FormData) => Promise<{
        success: boolean;
        error?: string;
    } | null>;
}) {

    const nameInputRef = useRef<HTMLInputElement>(null);
    const [serviceSlug, setServiceSlug] = useState(editingService?.slug || "");

    const handleGenerateSlug = () => {
        if (nameInputRef.current) {
            const generated = transliterate(nameInputRef.current.value);
            setServiceSlug(generated);
        }
    };

    const [state, formAction, isPending] = useActionState(actionFn, null);

    const router = useRouter();

    const handleDelete = async () => {
        if (!editingService) return;

        const confirmed = window.confirm(`Вы уверены, что желаете удалить услугу "${editingService.name}"?`);

        if (confirmed) {
            startTransition(async () => {
                const result = await deleteService(editingService.id);
                if (result.success) {
                    router.push("/controlpanel/services");
                } else {
                    alert(result.error || "Произошла ошибка при удалении");
                }
            });
        }
    };

    return (
        <form action={formAction} className="add-service-form" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Link href="/controlpanel/services" className="back-link">
                &larr; Назад к списку услуг
            </Link>

            <h3 style={{ marginTop: '12px' }}>{(uiAction === 'create') ? "Добавить услугу" : "Редактировать услугу"}</h3>

            {state?.error && (
                <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                    {state.error}
                </div>
            )}

            {(uiAction === 'edit' && editingService) && (
                <input type="hidden" name="service_id" value={editingService.id} />
            )}

            <div className="form-group">
                <label htmlFor="name">Название услуги *</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    ref={nameInputRef} // Привязываем ref сюда
                    placeholder="Например: Чистка от пыли и замена термопасты"
                    required
                    defaultValue={editingService?.name || ""}
                />
            </div>

            <div className="form-group">
                <label htmlFor="slug">URL услуги (Английскими буквами) *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={serviceSlug}
                        onChange={(e) => setServiceSlug(e.target.value)} 
                        placeholder={`${editingService ? `service-id${editingService.id}` : 'new-service'}`}
                        // placeholder="chistka-ot-pyli"
                        required
                        style={{ flexGrow: 1 }}
                    />
                    <button
                        type="button" 
                        onClick={handleGenerateSlug}
                        style={{ padding: '0 16px', backgroundColor: '#e5e7eb', color: '#374151', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                    >
                        Сгенерировать
                    </button>
                </div>
                <small style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    Этот адрес будет отображаться в браузере. Только латинские буквы, цифры и дефис.
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="description">Описание (необязательно)</label>
                <textarea
                    name="description"
                    id="description"
                    placeholder="Что входит в услугу, какие гарантии..."
                    rows={3}
                    defaultValue={editingService?.description || ""}
                />
            </div>

            <div className="form-group">
                <label htmlFor="device_type">Тип устройства</label>
                <select name="device_type" id="device_type" defaultValue={editingService?.device_type || "COMMON"}>
                    <option value="DESKTOP">Ремонт ПК</option>
                    <option value="LAPTOP">Ремонт Ноутбуков</option>
                    <option value="COMMON">Общая услуга</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                    <label htmlFor="price">Цена (BYN) *</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        min="0"
                        placeholder="50"
                        required
                        defaultValue={editingService?.price || undefined}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="unit">Единица измерения</label>
                    <select name="unit" id="unit" defaultValue={editingService?.unit || "FIXED"}>
                        <option value="FIXED">Фиксированная цена</option>
                        <option value="PER_HOUR">За час работы</option>
                        <option value="PER_ITEM">За штуку / деталь</option>
                    </select>
                </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '24px 0' }}>
                <input
                    type="checkbox"
                    name="isStartingPrice"
                    id="isStartingPrice"
                    style={{ width: 'auto', cursor: 'pointer' }}
                    defaultChecked={editingService?.isStartingPrice || false}
                />
                <label htmlFor="isStartingPrice" style={{ margin: 0, cursor: 'pointer', userSelect: 'none' }}>
                    Начальная цена?
                </label>
            </div>

            <div className="form-group">
                <label htmlFor="displayOrder">Порядок отображения</label>
                <input
                    type="number"
                    name="displayOrder"
                    id="displayOrder"
                    min="1"
                    defaultValue={editingService?.displayOrder || 10}
                />
                <small style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    Чем меньше число, тем выше услуга будет в списке таблицы.
                </small>
            </div>


            <div className="form-actions-group" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                    type="submit"
                    className="save-button"
                    disabled={isPending}
                    style={{ flexGrow: 1 }}
                >
                    {isPending ? "Сохранение..." : (uiAction === 'create' ? "Добавить услугу" : "Сохранить изменения")}
                </button>

                {uiAction === 'edit' && (
                    <button
                        type="button"
                        className="delete-button"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        Удалить услугу
                    </button>
                )}
            </div>
        </form>
    );
}