'use client';

import { useActionState, useState } from "react";
import { updateSettings } from "./actions";
import { ImageUploader } from "@/components/ControlPanel/ImageUploader/ImageUploader";
import { updateSiteSetting } from "@/app/actions";
import { Page } from "../editor/page";

export default function SettingsForm({ allPages, initialSettings }: { allPages?: Page[]; initialSettings: Record<string, string> }) {
    const [state, formAction, isPending] = useActionState(updateSettings, null);
    const [logoUrl, setLogoUrl] = useState('');

    const handleSave = async (url: string) => {
        // setStatus('saving');
        // setLogoUrl(url);
        const res = await updateSiteSetting('site_logo', url);

        if (res.success) {
            // setStatus('success');
            // setTimeout(() => setStatus('idle'), 3000);
        } else {
            // setStatus('error');
        }
    };

    const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState({
        type: (initialSettings['privacy_policy_type']) || "inputUrl",
        url: (initialSettings['privacy_policy_url']) || "",
    });

    const [publicOfferUrl, setPublicOfferUrl] = useState({
        type: (initialSettings['public_offer_type']) || "inputUrl",
        url: '',
    });

    const formatSlug = (slug: string) => slug === '/' ? slug : `/${slug}`;

    return (
        <form action={(data) => {
            data.append('privacy_policy_url', privacyPolicyUrl.url);
            data.append('privacy_policy_type', privacyPolicyUrl.type);
            data.append('public_offer_type', publicOfferUrl.type);
            data.append('public_offer_url', publicOfferUrl.url);
            formAction(data);
        }} className="control-form" style={{ maxWidth: '600px', margin: '0 auto' }} onSubmit={() => handleSave(logoUrl)}>
            <h2>Настройки сайта</h2>

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
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="site_description">Логотип</label>
                    <ImageUploader
                        value={logoUrl}
                        onChange={(url) => setLogoUrl(url)}
                        label=""
                    />
                </div>


            </fieldset>

            <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <legend>Правовые документы</legend>

                <div className="form-group">
                    <label htmlFor="privacy_policy_url">
                        <b>Страница Политики Конфиденциальности</b>
                    </label>
                    <select
                        name="privacy_policy_url"
                        id="privacy_policy_url"
                        defaultValue={privacyPolicyUrl.type === 'inputUrl' ? '<inputURL>' : ''}
                        onChange={(e) => setPrivacyPolicyUrl({
                            type: (e.target.value === '<inputURL>') ? "inputUrl" : "pageUrl",
                            url: e.target.value,
                        })}
                    >
                        {allPages?.map(page => (
                            <option value={formatSlug(page.slug)}>{page.name} [{formatSlug(page.slug)}]</option>
                        ))}
                        <option value="<inputURL>">Ввести URL...</option>
                    </select>
                    {(privacyPolicyUrl.type === 'inputUrl') && <div className="form-group__row">
                        <span>URL:</span>
                        <input
                            type="text"
                            name="privacy_policy_url"
                            id="privacy_policy_url"
                            placeholder="/privacy или https://..."
                            defaultValue={initialSettings["privacy_policy_url"] || "/privacy"}
                        />
                    </div>}
                </div>

                <div className="form-group">
                    <label htmlFor="public_offer_url">
                        <b>Страница Договора Публичной Оферты</b>
                    </label>
                    <select
                        // name="public_offer_url"
                        // id="public_offer_url"
                        defaultValue={publicOfferUrl.type === 'inputUrl' ? '<inputURL>' : ''}
                        onChange={(e) => setPublicOfferUrl({
                            type: (e.target.value === '<inputURL>') ? "inputUrl" : "pageUrl",
                            url: e.target.value,
                        })}
                    >
                        {allPages?.map(page => (
                            <option value={formatSlug(page.slug)}>{page.name} [{formatSlug(page.slug)}]</option>
                        ))}
                        <option value="<inputURL>">Ввести URL...</option>
                    </select>
                    {(publicOfferUrl.type === 'inputUrl') && <div className="form-group__row">
                        <span>URL:</span>
                        <input
                            type="text"
                            // name="privacy_policy_url"
                            // id="privacy_policy_url"
                            placeholder="/offer или https://..."
                            defaultValue={initialSettings["public_offer_url"] || "/offer"}
                        />
                    </div>}
                    {/* <input
                        type="text"
                        name="public_offer_url"
                        id="public_offer_url"
                        placeholder="/offer или https://..."
                        defaultValue={initialSettings["public_offer_url"] || "/offer"}
                    /> */}
                </div>
            </fieldset>

            <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                <legend>Контактная информация</legend>

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