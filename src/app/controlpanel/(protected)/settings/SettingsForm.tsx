'use client';

import { useActionState } from "react";
import { updateSettings } from "./actions";

export default function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
    const [state, formAction, isPending] = useActionState(updateSettings, null);

    return (
        <form action={formAction} className="control-form" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Настройки сайта</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
                
            </p>

            {state?.error && (
                <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div style={{ color: '#16a34a', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                    {state.message}
                </div>
            )}

            <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <legend>Общие настройки</legend>
                
                <div className="form-group">
                    <label htmlFor="site_title">Название сайта</label>
                    <input 
                        type="text" 
                        name="site_title" 
                        id="site_title" 
                        defaultValue={initialSettings["site_title"] || "Новое Название Сайта"} 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="site_description">Описание сайта</label>
                    <textarea 
                        name="site_description" 
                        id="site_description" 
                        rows={2}
                        defaultValue={initialSettings["site_description"] || "Профессиональный ремонт ПК и ноутбуков"} 
                        // style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                </div>
            </fieldset>

            <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                <legend>Контактные данные</legend>

                <div className="form-group">
                    <label htmlFor="contact_phone">Номер телефона</label>
                    <input 
                        type="text" 
                        name="contact_phone" 
                        id="contact_phone" 
                        placeholder="+375(29)123-45-67"
                        defaultValue={initialSettings["contact_phone"] || ""} 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contact_email">E-mail</label>
                    <input 
                        type="email" 
                        name="contact_email" 
                        id="contact_email" 
                        placeholder="email@site.com"
                        defaultValue={initialSettings["contact_email"] || ""} 
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                        <label htmlFor="work_hours">График работы</label>
                        <input 
                            type="text" 
                            name="work_hours" 
                            id="work_hours" 
                            placeholder="Пн-Пт: 10:00-19:00"
                            defaultValue={initialSettings["work_hours"] || ""} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="order_hours">Прием заявок</label>
                        <input 
                            type="text" 
                            name="order_hours" 
                            id="order_hours" 
                            placeholder="24/7"
                            defaultValue={initialSettings["order_hours"] || ""} 
                        />
                    </div>
                </div>
            </fieldset>

            <button type="submit" className="save-button" disabled={isPending} style={{ width: '100%' }}>
                {isPending ? "Сохранение..." : "Сохранить настройки"}
            </button>
        </form>
    );
}