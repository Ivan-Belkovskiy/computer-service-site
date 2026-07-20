
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import "./page.css";

export const revalidate = 0;

export default async function ClientsPage() {
  const clients = await prisma.clients.findMany({
    include: {
      orders: true,
    },
    orderBy: {
      full_name: "asc",
    },
  });

  return (
    <div className="clients-page">
      <div className="clients-page__header">
        <div>
          <h2>Клиенты</h2>
          <p className="text-sm text-gray-500 mt-1">
            Всего зарегистрировано клиентов в системе: <span className="font-semibold text-blue-600">{clients.length}</span>
          </p>
        </div>
      </div>

      <div className="clients-table-wrapper">
        <table className="clients-table">
          <thead>
            <tr>
              <th>ФИО Клиента</th>
              <th>Контактная информация</th>
              <th>Заявки</th>
              <th>Общая сумма </th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  В базе данных пока нет клиентов
                </td>
              </tr>
            ) : (
              clients.map((client) => {
                const totalOrders = client.orders.length;

                const totalSpent = client.orders.reduce(
                  (sum, order) => sum + (order.total_price || 0),
                  0
                );

                return (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-950">
                      {client.full_name}
                    </td>

                    <td className="px-6 py-4 space-y-0.5">
                      <div className="clients-table__phone">{client.phone}</div>
                      {client.email && (
                        <div className="clients-table__email">{client.email}</div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Link
                      href={`/controlpanel/orders?filters_clientId=${client.id}`}
                      className="clients-table__order-count"
                      //  className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full ${totalOrders > 0 ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-gray-100 text-gray-400"
                        // }`}
                        >
                        {totalOrders}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-gray-950">
                      {totalSpent > 0 ? (
                        <span className="text-emerald-600">{totalSpent.toLocaleString()} BYN</span>
                      ) : (
                        <span className="text-gray-400">0 BYN</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}