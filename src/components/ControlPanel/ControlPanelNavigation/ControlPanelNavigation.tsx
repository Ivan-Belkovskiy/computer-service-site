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
                        <Link href="/control-panel/">Основная информация</Link>
                    </li>
                    <li className="control-panel-navigation__button link">
                        <Link href="/control-panel/data">Данные</Link>
                    </li>
                </ul>
                <ul className="control-panel-navigation__right">
                    <button className="control-panel-navigation__button return-to-site-btn">
                        <Link href="/">↩ Перейти на сайт</Link>
                    </button>
                </ul>
            </nav>
        </div>
    )
}