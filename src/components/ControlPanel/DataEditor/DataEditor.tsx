'use client';

import { useEffect, useState } from "react";
import "./DataEditor.css";
import { Service } from "@/types/types";
import { getServices, updateServices } from "@/app/actions";
import { DeviceType, PricingUnit } from "@prisma/client";

export default function DataEditor() {

    const [services, setServices] = useState<Service[]>([]);
    const [isUploading, setUploading] = useState(false);

    const loadServices = async () => {
        try {
            const result = await getServices();

            if (result.data) {
                setServices(result.data);
            }
        } catch (error) {

        }
    }

    const uploadServices = async () => {
        try {
            setUploading(true);
            const result = await updateServices(services);

            if (result.data) {
                loadServices();
                setUploading(false);
            }
        } catch (error) {
            alert('Error! ' + error);
        }
    }

    useEffect(() => {
        loadServices();
    }, []);

    return (
        <div className="data-editor">
            <h1 className="data-editor__title">Данные</h1>
            <div className="data-editor__content">
                <h2 className="data-editor__subtitle">Услуги</h2>
                <div className="data-editor__list">
                    {services.map((s, idx) => (
                        <div className="data-editor__block" key={s.id}>
                            <span className="data-editor__label">№{idx + 1}</span>
                            <input
                                type="text"
                                className="data-editor__input"
                                value={s.name || ""}
                                onChange={(e) => setServices(p =>
                                    p.map((_, i) => i === idx ? {
                                        ..._,
                                        name: e.target.value,
                                    } : _)
                                )}
                            />
                            <select
                                className="data-editor__select"
                                value={s.device_type}
                                onChange={(e) => setServices(p =>
                                    p.map((_, i) => i === idx ? {
                                        ..._,
                                        device_type: e.target.value as DeviceType,
                                    } : _)
                                )}
                            >
                                <option value="COMMON">Общие услуги</option>
                                <option value="DESKTOP">Ремонт/обслуживание ноутбуков</option>
                                <option value="LAPTOP">Ремонт/обслуживание компьютеров </option>
                            </select>
                            <span className="data-editor__label">Стоимость:</span>
                            <input
                                type="number"
                                className="data-editor__input price-input"
                                value={s.price}
                                onChange={(e) => setServices(p =>
                                    p.map((_, i) => i === idx ? {
                                        ..._,
                                        price: Number(e.target.value),
                                    } : _)
                                )}
                            />
                            <span className="data-editor__label">BYN</span>

                            <select
                                className="data-editor__select price-unit-select"
                                value={s.unit}
                                onChange={(e) => setServices(p =>
                                    p.map((_, i) => i === idx ? {
                                        ..._,
                                        unit: e.target.value as PricingUnit,
                                    } : _)
                                )}
                            >
                                <option value="FIXED"></option>
                                <option value="PER_HOUR">/ час</option>
                                <option value="PER_ITEM">/ шт.</option>
                            </select>

                            <span className="data-editor__label">Стартовая цена?</span>
                            <input
                                type="checkbox"
                                className="data-editor__input starting-price-checkbox"
                                checked={s.isStartingPrice}
                                onChange={(e) => setServices(p =>
                                    p.map((_, i) => i === idx ? {
                                        ..._,
                                        isStartingPrice: e.target.checked,
                                    } : _)
                                )}
                            />

                        </div>
                    ))}
                </div>
            </div>
            <div className="data-editor__buttons">
                <button
                    className="data-editor__button"
                    onClick={uploadServices}
                    disabled={isUploading}
                >Обновить информацию</button>
            </div>
        </div>
    )
}