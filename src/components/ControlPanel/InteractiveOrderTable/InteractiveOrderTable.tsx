'use client';

import { Order } from "@/app/controlpanel/(protected)/orders/page";
import { formatDate } from "@/utils/date";
import Link from "next/link";

export interface InteractiveOrderTableFilters {
    clientId?: number;
}

export interface InteractiveOrderTableProps {
    orders: Order[];
    translations: Record<string, string>;
    filters?: InteractiveOrderTableFilters;
}

export default function InteractiveOrderTable({
    orders,
    translations,
    filters
}: InteractiveOrderTableProps) {

    const filtered = orders.filter(order => {
        if (!filters) return true;
        const matchClientId = (filters.clientId) ? order.client_id === filters.clientId : true;

        return matchClientId;
    });

    return (
        <div className="orders-table-wrapper">
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата</th>
                        <th>Клиент</th>
                        <th>Описание проблемы</th>
                        <th>Статус</th>
                        <th>Мастер</th>
                        <th>Сумма (BYN)</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center">Заявок пока нет</td>
                        </tr>
                    ) : (
                        filtered.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <Link href={`/controlpanel/orders/${order.id}`} className="text-[#720281] hover:underline font-bold">
                                        #{order.id}
                                    </Link>
                                </td>
                                {/* <td>#{order.id}</td> */}
                                <td>{formatDate(order.created_at)}</td>
                                <td>
                                    <div className="font-bold">{order.clients?.full_name || "Не указан"}</div>
                                    <div className="text-sm text-gray-500">{order.clients?.phone || ""}</div>
                                </td>
                                <td className="orders-table__desc">{order.description || "—"}</td>
                                <td>
                                    <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                        {order.status ? translations[order.status] : "—"}
                                    </span>
                                </td>
                                <td>{order.masters?.full_name || "Не назначен"}</td>
                                <td className="orders-table__price">{order.total_price ? `${order.total_price} BYN` : "—"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}