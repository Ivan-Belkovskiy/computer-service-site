import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderControlForm from "./OrderControlForm";
import "./page.css";

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id, 10);

    const [order, allMasters] = await Promise.all([
        prisma.orders.findUnique({
            where: { id: orderId },
            include: { clients: true, masters: true },
        }),
        prisma.masters.findMany({ orderBy: { full_name: "asc" } })
    ]);

    if (!order) notFound();

    return (
        <div className="order-details-page">
            <Link href="/controlpanel/orders" className="back-link">
                &larr; Назад к списку заявок
            </Link>
            
            <header className="order-details-header">
                <h2>Заявка #{order.id}</h2>
                <p className="order-date">от {order.created_at?.toLocaleString("ru-RU")}</p>
            </header>

            <div className="order-details-grid">
                <div className="info-section">
                    <div className="info-card">
                        <h3>Данные клиента</h3>
                        <p><strong>Имя:</strong> {order.clients?.full_name || "Не указано"}</p>
                        <p><strong>Телефон:</strong> {order.clients?.phone || "Не указан"}</p>
                        <p><strong>Адрес ремонта:</strong> {order.address || "В мастерской"}</p>
                    </div>

                    <div className="info-card">
                        <h3>Описание неисправности</h3>
                        <p className="description-text">{order.description || "Описание отсутствует"}</p>
                    </div>
                </div>

                <OrderControlForm order={order} allMasters={allMasters} />
            </div>
        </div>
    );
}