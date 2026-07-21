'use client';

import { useEffect, useState } from "react";
// import PhoneInput from "../PhoneInput/PhoneInput";
import "./NewPageModal.css";
import { createOrder } from "@/app/actions";
import { transliterate } from "@/utils/transliterator";
import { createPage } from "@/app/actions/editor";

interface ValidationErrors {
    name?: boolean;
    url?: boolean;
}

export default function NewPageModal({ isOpened, onClose, onSubmit }: {
    isOpened?: boolean;
    onSubmit?: () => void;
    onClose?: () => void;
}) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        error?: unknown;
        orderId?: number;
    }>();

    const [name, setName] = useState<string>("");
    const [url, setURL] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [displayInNavigation, setDisplayInNavigation] = useState(true);

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const validateData = (name: string, url: string) => {
        const isNameValid = name.trim().length > 2;
        const isUrlValid = url.length >= 5;

        setValidationErrors({
            name: !isNameValid,
            url: !isUrlValid
        });

        return isNameValid && isUrlValid;
    };

    const handleSubmit = async () => {
        if (validateData(name, url)) {
            setLoading(true);
            const res = await createPage(name, url, displayInNavigation, description);
            setLoading(false);
            // setSubmitResult(res);
            if (res.success) onSubmit?.();
        }
    };

    const renderError = (type: keyof ValidationErrors, message: string) => {
        if (validationErrors[type]) return (
            <p className="new-page-modal__error">{message}</p>
        );
    };

    const handleGenerateURL = () => {
        const generated = transliterate(name);
        setURL(generated);
    };

    useEffect(() => {
        if (isOpened) {
            if (submitResult) setSubmitResult(undefined);
            setName("");
            setURL("");
            setValidationErrors({});
        }
    }, [isOpened]);

    return (
        <div className={`new-page-modal__overlay ${isOpened ? 'opened' : ''}`}>
            <div className="new-page-modal">
                <button className="new-page-modal__button close-btn" onClick={onClose}>⨉</button>
                <h1 className="new-page-modal__title">
                    Создание страницы
                </h1>

                <div className="new-page-modal__block">
                    <span className="new-page-modal__label">Название:</span>
                    <input
                        type="text"
                        className={`new-page-modal__input ${validationErrors.name ? 'validation-error' : ''}`}
                        placeholder="Новая Страница"
                        value={name}
                        onChange={(e) => {
                            setValidationErrors({ ...validationErrors, name: false });
                            setName(e.target.value);
                        }}
                    />
                </div>
                {renderError('name', 'Название должно быть длиннее 2 символов')}


                <div className="new-page-modal__block">
                    <span className="new-page-modal__label">URL страницы:</span>
                    <input
                        type="text"
                        className="new-page-modal__input"
                        placeholder="new-page"
                        value={url}
                        onChange={(e) => setURL(e.target.value)}
                    />
                    <button className="new-page-modal__button" onClick={handleGenerateURL}>Сгенерировать</button>
                </div>
                {renderError('url', 'URL должен быть длиннее 5 символов')}

                <div className="new-page-modal__block">
                    <span className="new-page-modal__label">Описание:</span>
                    <textarea
                        className="new-page-modal__input"
                        placeholder="Описание страницы..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="new-page-modal__block">
                    <span className="new-page-modal__label">Отображать в меню навигации:</span>
                    <input
                        type="checkbox"
                        className="new-page-modal__checkbox"
                        checked={displayInNavigation}
                        onChange={(e) => setDisplayInNavigation(e.target.checked)}
                    />
                </div>

                <button
                    className="new-page-modal__button submit-button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? "Создание..." : "Создать страницу"}
                </button>
            </div>
        </div>
    );
}