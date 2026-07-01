import SVGIcon from "@/components/SVGIcon/SVGIcon";
import "./ContactsBlock.css";
import { CSSProperties, useEffect, useState } from "react";
import { getSiteSettings } from "@/app/actions";

interface ContactsBlockProps {
    lightIcons?: boolean;
    style?: CSSProperties;
    initialSettings?: {
        contact_phone?: string;
        work_hours?: string;
    };
}

export default function ContactsBlock({ lightIcons, style, initialSettings }: ContactsBlockProps) {
    const [displayInfo, setDisplayInfo] = useState({
        contact_phone: initialSettings?.contact_phone || "+375(29)123-45-67",
        work_hours: initialSettings?.work_hours || "пн-пт 10:00 - 19:00"
    });

    const updateInformation = async () => {
        const res = await getSiteSettings();
        if (res.data) {
            setDisplayInfo({
                contact_phone: res.data['contact_phone'] ?? displayInfo.contact_phone,
                work_hours: res.data['work_hours'] ?? displayInfo.work_hours
            });
        }
    };

    useEffect(() => {
        if (!initialSettings) {
            updateInformation();
        }
    }, [initialSettings]);

    const cleanPhoneLink = `tel:${displayInfo.contact_phone.replace(/[^+\d]/g, "")}`;

    return (
        <div className={`contacts-block ${lightIcons ? 'light' : ''}`} style={style}>
            <a className="contacts-block__span phone-number" href={cleanPhoneLink}>
                <SVGIcon
                    width={20}
                    height={20}
                    style={{ marginRight: '8px', filter: lightIcons ? 'brightness(0) invert(1)' : '' }}
                    imgSrc="/icons/turbowarp/phone.svg"
                />
                {displayInfo.contact_phone}
            </a>
            <span>
                <SVGIcon
                    width={20}
                    height={20}
                    style={{ marginRight: '8px', filter: lightIcons ? 'brightness(0) invert(1)' : '' }}
                    imgSrc="/icons/turbowarp/time-clock.svg"
                />
                {displayInfo.work_hours}
            </span>
        </div>
    );
}