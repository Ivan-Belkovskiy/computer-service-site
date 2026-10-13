'use client';

import { useEffect, useState } from "react";
import PhoneInput from "../PhoneInput/PhoneInput";
import "./NewOrderModal.css";
import { createOrder } from "@/app/actions";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/tracking";

type LegalDocumentLink = {
    id: number;
    slug: string;
    title: string;
    url: string;
    url_type: "PAGE" | "EXTERNAL";
    show_in_footer: boolean;
    show_in_modal: boolean;
};

interface ValidationErrors {
    name?: boolean;
    phone?: boolean;
    agreed?: boolean;
}

export default function NewOrderModal({ isOpened, onClose, onSubmit, privacyUrl = "/privacy",
    offerUrl = "/offer", legalDocuments = [] }: {
        isOpened?: boolean;
        onSubmit?: () => void;
        onClose?: () => void;
        privacyUrl?: string;
        offerUrl?: string;
        legalDocuments?: LegalDocumentLink[];
    }) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        error?: unknown;
        orderId?: number;
    }>();

    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [isAgreed, setIsAgreed] = useState<boolean>(true);

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const consentDocs = legalDocuments.filter((d) => d.show_in_modal);

    const validateData = (name: string, phone: string, agreed: boolean) => {
        const isNameValid = name.trim().length > 2;
        const isPhoneValid = phone.length >= 17;

        setValidationErrors({
            name: !isNameValid,
            phone: !isPhoneValid,
            agreed: !agreed
        });

        return isNameValid && isPhoneValid && agreed;
    };

    const currentUrl = usePathname();

    const handleSubmit = async () => {
        if (validateData(name, phone, isAgreed)) {
            setLoading(true);
            trackEvent('order_modal_submit', currentUrl);
            const res = await createOrder(name, phone, description, email, address);
            setLoading(false);
            setSubmitResult(res);
            if (res.success) onSubmit?.();
        }
    };

    const renderError = (type: keyof ValidationErrors, message: string) => {
        if (validationErrors[type]) return (
            <p className="new-order-modal__error">{message}</p>
        );
    };

    useEffect(() => {
        if (isOpened) {
            trackEvent('order_modal_open', currentUrl);
            if (submitResult) setSubmitResult(undefined);
            setName("");
            setPhone("");
            setEmail("");
            setAddress("");
            setDescription("");
            setIsAgreed(false);
            setValidationErrors({});
        }
    }, [isOpened]);

    return (
        <div className={`new-order-modal__overlay ${isOpened ? 'opened' : ''}`}>
            <div className="new-order-modal">
                <button className="new-order-modal__button close-btn" onClick={onClose}>⨉</button>
                <h1 className="new-order-modal__title">
                    {submitResult ? (submitResult.success ? 'Заявка принята!' : 'Произошла ошибка') : "Оставить заявку"}
                </h1>

                {submitResult ? (
                    <>
                        <p className="new-order-modal__messagebox">
                            {submitResult.success ? `Номер вашей заявки: №${submitResult.orderId}. Мы свяжемся с вами в ближайшее время.` : String(submitResult.error)}
                        </p>
                        <button className="new-order-modal__button submit-button" onClick={onClose}>ОК!</button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            className={`new-order-modal__input ${validationErrors.name ? 'validation-error' : ''}`}
                            placeholder="Ваше имя *"
                            value={name}
                            onChange={(e) => {
                                setValidationErrors({ ...validationErrors, name: false });
                                setName(e.target.value);
                            }}
                        />
                        {renderError('name', 'Имя должно быть длиннее 2 символов')}

                        <PhoneInput
                            className={`new-order-modal__input ${validationErrors.phone ? 'validation-error' : ''}`}
                            onChange={(v) => {
                                setValidationErrors({ ...validationErrors, phone: false });
                                setPhone(v);
                            }}
                            value={phone}
                        />
                        {renderError('phone', 'Введите корректный номер телефона')}

                        <input
                            type="email"
                            className="new-order-modal__input"
                            placeholder="Email (необязательно)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="text"
                            className="new-order-modal__input"
                            placeholder="Адрес выезда (если необходим выезд мастера)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <textarea
                            className="new-order-modal__input"
                            placeholder="Опишите ситуацию (что случилось с компьютером?)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>

                        <div
                            className={`new-order-modal__agreement ${validationErrors.agreed ? "validation-error" : ""
                                }`}
                        >
                            <input
                                className="new-order-modal__checkbox"
                                type="checkbox"
                                checked={isAgreed}
                                onChange={(e) => {
                                    setValidationErrors({ ...validationErrors, agreed: false });
                                    setIsAgreed(e.target.checked);
                                }}
                            />
                            <span>
                                Я ознакомлен(а) и согласен(на) со следующими документами:{" "}
                                {consentDocs.length === 0 ? (
                                    "условиями обработки заявки"
                                ) : (
                                    consentDocs.map((doc, index) => (
                                        <span key={doc.id}>
                                            {index > 0 && ", "}
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {doc.title}
                                            </a>
                                        </span>
                                    ))
                                )}
                                *
                            </span>
                        </div>
                        {renderError('agreed', 'Для отправки формы необходимо согласие')}

                        <button
                            className="new-order-modal__button submit-button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Отправка..." : "Отправить"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}