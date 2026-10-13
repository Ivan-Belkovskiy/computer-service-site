'use client';

import { useState } from "react";
import NewOrderModal from "@/components/UI/NewOrderModal/NewOrderModal";
import { LegalDocumentLink } from "@/components/AppLayout";

interface ServiceOrderWrapperProps {
    serviceName: string;
    legalDocuments?: LegalDocumentLink[];
}

export default function ServiceOrderWrapper({ serviceName, legalDocuments }: ServiceOrderWrapperProps) {
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

                legalDocuments={legalDocuments}
                // onSubmit={() => setModalOpened(false)}
            />
        </>
    );
}