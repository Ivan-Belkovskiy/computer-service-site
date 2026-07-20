'use client';

import Image from "next/image";
import "./ControlPanelNavigation.css";
import Link from "next/link";

export default function ControlPanelNavigation() {
    return (
        <div className="control-panel-navigation__container">
            <nav className="control-panel-navigation">
                <ul className="control-panel-navigation__left">
                    <li className="control-panel-navigation__button">
                        <Image
                            width={144}
                            height={36}
                            src="/site-temp-logo.svg"
                            alt="Site Logo"
                        />
                    </li>
                    <h1 className="control-panel-navigation__title">Панель Управления</h1>
                </ul>
                <ul className="control-panel-navigation__middle">
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
                    {/* <li className="control-panel-navigation__button link">
                        <Link href="/controlpanel/">Основная информация</Link>
                    </li>
                    <li className="control-panel-navigation__button link">
                        <Link href="/controlpanel/data">Данные</Link>
                    </li> */}
                </ul>
                <li className="control-panel-navigation__right">
                    <Link href="/" target="_blank" className="control-panel-navigation__button return-to-site-btn">
                        ↩ Перейти на сайт
                    </Link>
                </li>
            </nav>
        </div>
    )
}