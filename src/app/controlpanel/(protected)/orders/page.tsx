import { prisma } from "@/lib/prisma";
import "./page.css";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import InteractiveOrderTable from "@/components/ControlPanel/InteractiveOrderTable/InteractiveOrderTable";

const statusTranslations: Record<string, string> = {
    CREATED: "Новая",
    IN_PROGRESS: "В работе",
    COMPLETED: "Завершена",
    CANCELLED: "Отменена",
};

export type Order = Prisma.OrderGetPayload<{
    include: {
        client: true,
        master: true,
    },
}>;

export default async function OrdersPage({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;


    const filterClientID = (typeof params.filters_clientId === 'string') ? Number(params.filters_clientId) : undefined;

    // const filterClientName = await prisma.client

    // const orders = await prisma.order.findMany({
    //     orderBy: { created_at: "desc" },
    //     include: {
    //         clients: true,
    //         masters: true,
    //     },
    // });

    const [
        orders,
        filterClientName
    ] = await Promise.all([
        prisma.order.findMany({
            where: filterClientID ? { client_id: filterClientID } : undefined,
            orderBy: { created_at: "desc" },
            include: {
                client: true,
                master: true,
            },
        }),
        (typeof filterClientID === 'number') ? (await prisma.client.findUnique({
            where: { id: filterClientID },
            select: { full_name: true },
        }))?.full_name : undefined

    ])

    return (
        <div className="orders-page">
            <header className="orders-page__header">
                <h2>{(filterClientName) ? `Заявки клиента :: ${filterClientName}` : "Все заявки"}</h2>
                {(filterClientName) && <Link href="/controlpanel/orders" className="orders-page__button">Показать все заявки</Link>}
            </header>

            <InteractiveOrderTable orders={orders} translations={statusTranslations} filters={{
                clientId: filterClientID
            }} />
        </div>
    );
}