'use client';

import Image from "next/image";
import "./ControlPanelNavigation.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useControlPanel } from "@/context/ControlPanelContext";

export default function ControlPanelNavigation({ settings }: { settings?: Record<string, string> }) {
    const url = usePathname();
    
    const { sectionData, triggerSave, isSaving } = useControlPanel();

    const isCustomSectionEditor = url.startsWith('/controlpanel/editor/custom-sections/');

    if (url !== '/controlpanel/login') return (
        <div className="control-panel-navigation__container">
            <nav className="control-panel-navigation">
                <ul className="control-panel-navigation__left">
                    <li className="control-panel-navigation__button">
                        <Image
                            width={144}
                            height={36}
                            src={(settings?.['site_logo']) || "/site-temp-logo.svg"}
                            alt="Site Logo"
                        />
                    </li>
                    <h1 className="control-panel-navigation__title">Панель Управления</h1>
                </ul>
                
                <ul className="control-panel-navigation__middle">
                    {isCustomSectionEditor ? (
                        <li className="control-panel-navigation__button text-info">
                            <span>Редактирование секции: </span>
                            <strong>{sectionData?.name || sectionData?.title || 'Загрузка...'}</strong>
                        </li>
                    ) : (
                        <>
                            <li className="control-panel-navigation__button link">
                                <Link href="/controlpanel/clients">Клиенты</Link>
                            </li>
                            <li className="control-panel-navigation__button link">
                                <Link href="/controlpanel/orders">Заявки</Link>
                            </li>
                            <li className="control-panel-navigation__button link">
                                <Link href="/controlpanel/services">Услуги и Цены</Link>
                            </li>
                            <li className="control-panel-navigation__button link">
                                <Link href="/controlpanel/editor">Редактор сайта</Link>
                            </li>
                            <li className="control-panel-navigation__button link">
                                <Link href="/controlpanel/settings">Настройки сайта</Link>
                            </li>
                        </>
                    )}
                </ul>
                
                <div className="control-panel-navigation__right">
                    {(isCustomSectionEditor && sectionData) ? (
                        <>
                            <Link 
                                href={`/controlpanel/editor?initialMode=custom-sections&selectedCustomSection=${sectionData.id}`} 
                                className="control-panel-navigation__button return-to-site-btn"
                            >
                                ↩ Назад к списку секций
                            </Link>

                            <button
                                type="button"
                                onClick={triggerSave}
                                disabled={isSaving}
                                className="control-panel-navigation__button return-to-site-btn"
                                style={{ opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'wait' : 'pointer' }}
                            >
                                {isSaving ? 'Сохранение...' : 'Сохранить данные'}
                            </button>
                        </>
                    ) : (
                        <Link href="/" target="_blank" className="control-panel-navigation__button return-to-site-btn">
                            ↩ Перейти на сайт
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
}