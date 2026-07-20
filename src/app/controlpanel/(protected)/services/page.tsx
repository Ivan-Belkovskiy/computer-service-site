import { prisma } from "@/lib/prisma";
import Link from "next/link";
import "./services.css";

const unitTranslations: Record<string, string> = {
    FIXED: "",
    PER_HOUR: "/ час",
    PER_ITEM: "/ шт.",
};

const deviceTranslations: Record<string, string> = {
    DESKTOP: "Ремонт ПК",
    LAPTOP: "Ремонт Ноутбуков",
    COMMON: "Общие услуги",
};

export default async function ServicesPage() {
    const allServices = await prisma.services.findMany({
        orderBy: { 
            // name: "asc",
            displayOrder: 'asc',
         }
    });

    const groupedServices = {
        DESKTOP: allServices.filter(s => s.device_type === "DESKTOP"),
        LAPTOP: allServices.filter(s => s.device_type === "LAPTOP"),
        COMMON: allServices.filter(s => s.device_type === "COMMON"),
    };

    return (
        <div className="services-page">
            <header className="services-page__header">
                <h2>Услуги и Цены</h2>
                <div className="services-page__actions">
                    <Link href="/controlpanel/services/new" className="action-btn primary-btn" style={{ textDecoration: 'none' }}>
                        + Добавить услугу
                    </Link>
                </div>
            </header>

            {allServices.length === 0 ? (
                <div className="empty-state">Услуги еще не созданы.</div>
            ) : (
                <div className="categories-list">
                    {Object.entries(groupedServices).map(([deviceType, services]) => {
                        if (services.length === 0) return null;

                        return (
                            <section key={deviceType} className="category-section">
                                <div className="category-section__header">
                                    <h3>{deviceTranslations[deviceType]}</h3>
                                    <span className="category-count">Всего: {services.length}</span>
                                </div>

                                <div className="services-table-wrapper">
                                    <table className="services-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "60px" }}>Порядок</th>
                                                <th>Название услуги</th>
                                                <th style={{ width: "150px" }}>Цена (BYN)</th>
                                                <th style={{ width: "100px" }}>Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map((service) => (
                                                <tr key={service.id}>
                                                    <td className="text-center font-mono text-sm text-gray-400">
                                                        {service.displayOrder}
                                                    </td>
                                                    <td>
                                                        <div className="service-name">{service.name}</div>
                                                        {service.description && (
                                                            <div className="service-desc">{service.description}</div>
                                                        )}
                                                    </td>
                                                    <td className="service-price">
                                                        {service.isStartingPrice ? "от " : ""}
                                                        <strong>{service.price} BYN</strong>
                                                        <span className="price-unit"> {unitTranslations[service.unit]}</span>
                                                    </td>
                                                    <td>
                                                        <Link
                                                            href={`/controlpanel/services/edit/${service.id}`}
                                                            className="edit-link"
                                                        >
                                                            Редактировать
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}