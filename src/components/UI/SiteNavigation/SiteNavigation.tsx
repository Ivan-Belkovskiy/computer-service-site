'use client';

import "./SiteNavigation.css";
import Link from "next/link";
import SVGIcon from "../../SVGIcon/SVGIcon";
import Image from "next/image";
import { useState } from "react";
import ExpandableSidePanel from "../ExpandableSidePanel/ExpandableSidePanel";
import ContactsBlock from "../ContactsBlock/ContactsBlock";

export default function SiteNavigation({ menuOnly }: { menuOnly?: boolean; }) {

    const [isMobileMenuOpened, setMobileMenuOpened] = useState(false);

    const renderMenu = (inFooter?: boolean) => (
        <ul className={(inFooter) ? `site-navigation__menu` : `site-navigation__middle --desktop-only`}>
            <li className="site-navigation__button link">
                <Link href="/">Главная</Link>
            </li>
            <li className="site-navigation__button link">
                <Link href="/services">Услуги</Link>
            </li>
            <li className="site-navigation__button link">
                <Link href="/about">О нас</Link>
            </li>
            <li className="site-navigation__button link">
                <Link href="/contacts">Контакты</Link>
            </li>
        </ul>
    )

    if (menuOnly) return renderMenu(true);

    return (
        <header className="site-navigation__container">
            <nav className="site-navigation">
                <ul className="site-navigation__left">
                    <li className="site-navigation__button">
                        <Image
                            width={144}
                            height={36}
                            src="/site-temp-logo.svg"
                            alt="Site Logo"
                        />
                    </li>
                </ul>

                {renderMenu()}
                {/* <ul className="site-navigation__middle --desktop-only">
                    <li className="site-navigation__button link">
                        <Link href="/">Главная</Link>
                    </li>
                    <li className="site-navigation__button link">
                        <Link href="/services">Услуги</Link>
                    </li>
                    <li className="site-navigation__button link">
                        <Link href="/about">О нас</Link>
                    </li>
                    <li className="site-navigation__button link">
                        <Link href="/contacts">Контакты</Link>
                    </li>
                </ul> */}

                <ul className="site-navigation__right --desktop-only">
                    <li className="site-navigation__button">
                        <ContactsBlock />
                        {/* <div className="site-navigation__contacts-block">
                            <span>
                                <SVGIcon
                                    width={20}
                                    height={20}
                                    style={{ marginRight: '8px' }}
                                    imgSrc="/icons/turbowarp/phone.svg"
                                />
                                +375(29)123-45-67
                            </span>
                            <span>
                                <SVGIcon
                                    width={20}
                                    height={20}
                                    style={{ marginRight: '8px' }}
                                    imgSrc="/icons/turbowarp/time-clock.svg"
                                />
                                пн-пт 10:00 - 19:00
                            </span>
                        </div> */}
                    </li>
                </ul>
                <ul className="site-navigation__right --mobile-only">
                    <li className="site-navigation__button">
                        <button
                            className={`mobile-menu-button ${isMobileMenuOpened ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpened(p => !p)}
                        ></button>
                    </li>
                </ul>
            </nav>
            <ExpandableSidePanel isExpanded={isMobileMenuOpened} setExpanded={setMobileMenuOpened} mobileOnly elements={[
                {
                    content: 'Главная',
                    url: '/'
                },
                {
                    content: 'Услуги',
                    url: '/services'
                },
                {
                    content: 'О нас',
                    url: '/about'
                },
                {
                    content: 'Контакты',
                    url: '/contacts'
                },
            ]} />
        </header>
    )
}