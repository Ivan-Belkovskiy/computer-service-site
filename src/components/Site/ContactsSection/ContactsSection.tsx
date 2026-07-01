'use client';

import "./ContactsSection.css";
import SVGIcon from "@/components/SVGIcon/SVGIcon";
import { useState } from "react";
import NewOrderModal from "@/components/UI/NewOrderModal/NewOrderModal";

interface ContactInfo {
    id: number;
    label: string;
    icon?: {
        url: string;
        isLightMode?: boolean;
    };
    value: {
        displayText: string;
        linkUrl?: string;
    };
}

interface ContactsSectionProps {
    initialSettings: Record<string, string>;
}

export default function ContactsSection({ initialSettings }: ContactsSectionProps) {
    const [isModalOpened, setModalOpened] = useState(false);

    const CONTACT_INFORMATION: ContactInfo[] = [
        {
            id: 1,
            label: "Номер телефона",
            icon: { url: '/icons/turbowarp/phone.svg' },
            value: {
                displayText: initialSettings["contact_phone"] || "+375(29)123-45-67",
                linkUrl: `tel:${initialSettings["contact_phone"]?.replace(/[^+\d]/g, "") || "+375291234567"}`
            }
        },
        {
            id: 2,
            label: "График работы",
            icon: { url: "/icons/turbowarp/time-clock.svg" },
            value: {
                displayText: initialSettings["work_hours"] || "Пн-Пт: 10:00-19:00"
            },
        },
        {
            id: 3,
            label: "График приема заявок",
            icon: { url: "/icons/turbowarp/time-clock.svg" },
            value: {
                displayText: initialSettings["order_hours"] || "24/7"
            },
        },
        {
            id: 4,
            label: "E-mail",
            value: {
                displayText: initialSettings["contact_email"] || "email@site.com"
            }
        }
    ];

    return (
        <section className="contacts-section">
            <h2 className="contacts-section__title">Контакты</h2>
            <div className="contacts-section__content">
                <div className="contacts-section__block">
                    {CONTACT_INFORMATION.map((info) => (
                        <div className="contacts-section__info" key={info.id}>
                            <span className="contacts-section__label">{info.label}:</span>
                            <div className="contacts-section__data">
                                {info.icon && <SVGIcon
                                    className="contacts-section__icon"
                                    imgSrc={info.icon.url}
                                    style={{
                                        filter: info.icon.isLightMode ? 'brightness(0) invert(1)' : ''
                                    }}
                                    width={20}
                                    height={20}
                                />}
                                {info.value.linkUrl ? (
                                    <a className="contacts-section__link" href={info.value.linkUrl}>
                                        {info.value.displayText}
                                    </a>
                                ) : (
                                    <span className="contacts-section__value-text">{info.value.displayText}</span>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        className="contacts-section__button new-order-btn"
                        onClick={() => setModalOpened(true)}
                    >
                        Оставить заявку
                    </button>
                </div>
            </div>
            <NewOrderModal
                isOpened={isModalOpened}
                onClose={() => setModalOpened(false)}
                onSubmit={() => setModalOpened(false)}
            />
        </section>
    );
}