'use client';

import { useActionState, startTransition, useEffect } from "react";
import { updateOrder } from "../actions";
import { OrderStatus, masters, orders } from "@prisma/client";
import PopupNotification from "@/components/UI/PopupNotification/PopupNotification";

const statusTranslations: Record<OrderStatus, string> = {
    CREATED: "Новая",
    IN_PROGRESS: "В работе",
    COMPLETED: "Завершена",
    CANCELLED: "Отменена",
};

interface OrderControlFormProps {
    order: orders;
    allMasters: masters[];
}

export default function OrderControlForm({ order, allMasters }: OrderControlFormProps) {
    const [state, formAction, isPending] = useActionState(updateOrder, null);

    useEffect(() => {
        if (state?.success) {
            alert("Изменения успешно сохранены!");
        } else if (state?.error) {
            alert(state.error);
        }
    }, [state]);

    return (
        <div className="control-section">
            <form action={formAction} className="control-form">
                <input type="hidden" name="orderId" value={order.id} />

                <h3>Управление статусом и исполнением</h3>

                <div className="form-group">
                    <label htmlFor="status">Текущий статус</label>
                    <select 
                        name="status" 
                        id="status" 
                        key={order.status}
                        defaultValue={order.status || "CREATED"}
                    >
                        {Object.entries(statusTranslations).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="masterId">Назначенный мастер</label>
                    <select 
                        name="masterId" 
                        id="masterId" 
                        key={order.master_id || 'no-master'}
                        defaultValue={order.master_id || ""}
                    >
                        <option value="">-- Выберите мастера --</option>
                        {allMasters.map((master) => (
                            <option key={master.id} value={master.id}>
                                {master.full_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="totalPrice">Стоимость ремонта (BYN)</label>
                    <input 
                        type="number" 
                        name="totalPrice" 
                        id="totalPrice" 
                        key={order.total_price || 'no-price'}
                        defaultValue={order.total_price || ""} 
                        placeholder="Сумма пока не определена"
                        min="0"
                    />
                </div>

                <button type="submit" className="save-button" disabled={isPending}>
                    {isPending ? "Сохранение..." : "Сохранить изменения"}
                </button>

                {/* <PopupNotification 
                    position={{
                        right: 40,
                        bottom: 70,                        
                    }}
                >Уведомление</PopupNotification> */}
            </form>
        </div>
    );
}