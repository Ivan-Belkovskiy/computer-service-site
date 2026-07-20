'use client';

import { useState } from "react";
import NewOrderModal from "@/components/UI/NewOrderModal/NewOrderModal";

interface ServiceOrderWrapperProps {
    serviceName: string;
}

export default function ServiceOrderWrapper({ serviceName }: ServiceOrderWrapperProps) {
    const [isModalOpened, setModalOpened] = useState(false);

    return (
        <>
            <button 
                className="service-detail-page__button" 
                onClick={() => setModalOpened(true)}
                style={{ border: 'none', cursor: 'pointer' }}
            >
                Оставить заявку
            </button>

            <NewOrderModal 
                isOpened={isModalOpened} 
                onClose={() => setModalOpened(false)} 
                onSubmit={() => setModalOpened(false)}
            />
        </>
    );
}