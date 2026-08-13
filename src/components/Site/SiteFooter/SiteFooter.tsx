'use client';

import Image from "next/image";
import "./SiteFooter.css";
import ContactsBlock from "@/components/UI/ContactsBlock/ContactsBlock";
import SiteNavigation from "@/components/UI/SiteNavigation/SiteNavigation";
import { useState } from "react";
import NewOrderModal from "@/components/UI/NewOrderModal/NewOrderModal";

export default function SiteFooter({ settings, pageLinks }: {
    settings?: Record<string, string>; pageLinks: {
        id: number;
        name: string;
        slug: string;
    }[]
}) {

    const [isModalOpened, setModalOpened] = useState(false);

    return (
        <footer className="site-footer">
            <div className="site-footer__content">
                <div className="site-footer__column">
                    <Image
                        width={144}
                        height={36}
                        src={(settings?.['site_logo']) || "/site-temp-logo.svg"}
                        alt="Site Logo"
                        className="site-footer__logo"
                    />
                    <p>Профессиональное обслуживание и ремонт компьютеров в Минске</p>
                </div>
                <div className="site-footer__column">
                    <span className="site-footer__heading">Навигация</span>
                    <SiteNavigation menuOnly pageLinks={pageLinks} />
                </div>
                <div className="site-footer__column">
                    <span className="site-footer__heading">Контактная информация</span>
                    <ContactsBlock lightIcons style={{ gap: '6px', alignItems: 'start' }} initialSettings={{
                        contact_phone: settings?.contact_phone,
                        work_hours: settings?.work_hours
                    }} />
                    <button className="site-footer__button" onClick={() => setModalOpened(true)}>Оставить заявку</button>
                </div>
            </div>
            <span className="site-footer__label">© {new Date().getFullYear()} {settings?.['site_title'] || "computer-service-site"}</span>
            <NewOrderModal isOpened={isModalOpened} onClose={() => setModalOpened(false)} />
        </footer>
    )
}