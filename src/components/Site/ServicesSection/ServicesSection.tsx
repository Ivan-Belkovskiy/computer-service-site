// ./src/components/Site/ServicesSection/ServicesSection.tsx:

import { DeviceType } from "@prisma/client";
import "./ServicesSection.css";
import { prisma } from "@/lib/prisma";
import SVGIcon from "@/components/SVGIcon/SVGIcon";
import { formatPrice } from "@/utils/utils";
import Link from "next/link";

interface ServicesSectionProps {
    title?: string;
    limit?: number;
    showCategories?: boolean;
    deviceFilter?: DeviceType;
    globalPadding?: number;
}

export default async function ServicesSection({
    title = "Наши услуги",
    limit,
    showCategories = false,
    deviceFilter,
    globalPadding
}: ServicesSectionProps) {

    const services = await prisma.services.findMany({
        where: {
            device_type: deviceFilter,
        },
        orderBy: [
            { displayOrder: 'desc' }
        ]
    });

    const desktops = services.filter(s => s.device_type === "DESKTOP").slice(0, limit);
    const laptops = services.filter(s => s.device_type === "LAPTOP").slice(0, limit);
    const common = services.filter(s => s.device_type === "COMMON").slice(0, limit);

    const renderList = (items: typeof services, listTitle?: string, listIconUrl?: string) => {
        if (items.length === 0) return null;

        return (
            <div className="services-section__group">
                {/* {listTitle && <h3 className="services-section__subtitle">{listTitle}</h3>} */}
                {listTitle && <div className="services-section__header">
                    {(listIconUrl) && <SVGIcon
                        imgSrc={listIconUrl}
                        width={50}
                        height={50}
                    />}
                    <h3 className="services-section__subtitle">{listTitle}</h3>
                </div>}

                <ul className="services-section__list">
                    {items.map(s => (
                        <li className="services-section__block" key={s.id}>
                            <span className="services-section__name">{s.name}</span>

                            <span className="services-section__price">{formatPrice(s)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <section className="services-section" style={{ padding: (globalPadding) ? `${globalPadding}px 0` : '' }}>
            <h2 className="services-section__title">{title}</h2>

            <div className="services-section__content">

                {showCategories ? (
                    <>
                        {renderList(desktops, "Ремонт и обслуживание компьютеров", "/icons/turbowarp/services-section/pc-services.svg")}
                        {renderList(laptops, "Ремонт и обслуживание ноутбуков", "/icons/turbowarp/services-section/laptop-services.svg")}
                        {renderList(common, "Остальные услуги")}
                    </>
                ) : (
                    renderList(services)
                )}

                {limit && (
                    <div className="services-section__button-wrapper">
                        <button className="services-section__button">
                            <Link href="/services">Все услуги</Link>
                        </button>
                    </div>
                )}

            </div>
        </section>
    )
}