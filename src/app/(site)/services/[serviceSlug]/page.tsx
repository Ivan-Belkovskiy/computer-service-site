import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import "./page.css";
import ServiceOrderWrapper from "@/components/UI/ServiceOrderWrapper/ServiceOrderWrapper";
import { getSiteSettings } from "@/app/actions";

interface ServicePageProps {
    params: Promise<{ serviceSlug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.serviceSlug;

    const service = await prisma.services.findUnique({
        where: { slug: slug }
    });

    const response = await getSiteSettings();
    const settings = response.data || {};

    if (!service) {
        return {
            title: "Услуга не найдена",
        };
    }

    return {
        title: `${service.name} | ${settings?.title || "Computer-Service-Site"}`,
        description: service.description || `Профессиональные услуги по ремонту: ${service.name}. Быстро, качественно, с гарантией.`,
    };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.serviceSlug;

    const service = await prisma.services.findUnique({
        where: { slug: slug }
    });

    if (!service) {
        notFound();
    }

    return (
        <div className="service-detail-page">
            <Link href="/" style={{ color: '#720281', textDecoration: 'none', fontSize: '14px' }}>
                &larr; Назад на главную
            </Link>

            <main className="service-detail-page__main">
                <span className="service-detail-page__label" style={{
                    color: service.device_type === 'DESKTOP' ? '#2563eb' : service.device_type === 'LAPTOP' ? '#7c3aed' : '#059669',
                    backgroundColor: service.device_type === 'DESKTOP' ? '#eff6ff' : service.device_type === 'LAPTOP' ? '#f5f3ff' : '#ecfdf5'
                }}>
                    {service.device_type === 'DESKTOP' ? 'Ремонт и Обслуживание ПК' : service.device_type === 'LAPTOP' ? 'Ремонт и Обслуживание Ноутбуков' : 'Общая услуга'}
                </span>

                <h1 className="service-detail-page__title">{service.name}</h1>

                <div className="service-detail-page__price">
                    Стоимость: <strong>{service.isStartingPrice ? "от " : ""}{service.price} BYN</strong>
                </div>

                {service.description ? (
                    <div className="service-detail-page__block">
                        <h3>Подробное описание услуги:</h3>
                        <p className="service-detail-page__description">{service.description}</p>
                    </div>
                ) : (
                    <p className="service-detail-page__block">
                        Описание услуги будет дополнено в ближайшее время. Вы можете уточнить детали по телефону.
                    </p>
                )}

                <div className="service-detail-page__actions">
                    <div>
                        <h4>Нужна эта услуга?</h4>
                        <p>Оставьте заявку, и мы свяжемся с вами в течение 15 минут!</p>
                    </div>
                    <ServiceOrderWrapper serviceName={service.name || ""} />
                    {/* <Link href="/" className="service-detail-page__button">
                    Заказать
                </Link> */}
                </div>
            </main>

        </div >
    );
}


export async function generateStaticParams() {
    const services = await prisma.services.findMany({
        select: { slug: true }
    });

    return services.map((service) => ({
        slug: service.slug,
    }));
}