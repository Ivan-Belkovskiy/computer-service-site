import SVGIcon from "@/components/SVGIcon/SVGIcon";
import "./ContactsBlock.css";
import { CSSProperties } from "react";

export default function ContactsBlock({ lightIcons, style }: { lightIcons?: boolean, style?: CSSProperties }) {
    return (
        <div className={`contacts-block ${lightIcons ? 'light' : ''}`} style={style}>
            <a className="contacts-block__span phone-number" href="tel:+375291234567">
                <SVGIcon
                    width={20}
                    height={20}
                    style={{ marginRight: '8px', filter: (lightIcons) ? 'invert(1)': '' }}
                    imgSrc="/icons/turbowarp/phone.svg"
                />
                +375(29)123-45-67
            </a>
            <span>
                <SVGIcon
                    width={20}
                    height={20}
                    style={{ marginRight: '8px', filter: (lightIcons) ? 'invert(1)': '' }}
                    imgSrc="/icons/turbowarp/time-clock.svg"
                />
                пн-пт 10:00 - 19:00
            </span>
        </div>
    )
}