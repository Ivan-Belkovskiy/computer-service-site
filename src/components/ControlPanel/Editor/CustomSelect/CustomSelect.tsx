'use client';

import { useEffect, useState } from "react";
import "./CustomSelect.css";

export type CustomSelectElement<T = any> = ({
    type: "button";
    iconUrl?: string;
    label: string;
    // onClick?: () => void;
    value: T;
} | {
    type: "label";
    iconUrl?: string;
    label: string;
    value?: T;
}) & {
    key: string | number;
}

export interface CustomSelectProps<T = any> {
    className?: string;
    elements: CustomSelectElement[];
    value?: string | number;
    searchInput?: boolean;
    onSelect?: (newValue: T, key: string | number) => void | boolean;
}

export default function CustomSelect<V = any>({ className, value, elements, searchInput, onSelect }: CustomSelectProps<V>) {

    const [filterText, setFilterText] = useState('');

    const [currentKey, setCurrentKey] = useState<string | number>(elements.filter(e => e.type === 'button')?.[0].key);

    useEffect(() => {
        setCurrentKey(elements.filter(e => e.type === 'button')?.[0].key);
    }, [elements]);

    useEffect(() => setCurrentKey(value || elements.filter(e => e.type === 'button')?.[0].key), [value]);

    const [isOpened, setOpened] = useState(false);

    const filtered = elements.filter(el => {
        if (filterText.length === 0) return true;

        return el.label.includes(filterText);
    });

    const displayText = elements.find(e => e.key === currentKey)?.label;

    return (
        <div className={`custom-select`}>
            <div className={`custom-select__display ${className || "site-editor__select"}`} onClick={() => setOpened(p => !p)}>
                <span>{displayText}</span>
                <button>▽</button>
            </div>
            <div className={`custom-select__dropdown ${isOpened ? 'opened' : ''}`}>
                {(searchInput) && (<input
                    type="text"
                    className="custom-select__input"
                    placeholder="Найти блок..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />)}
                <div className="custom-select__elements">
                    {filtered.map((e, idx) => (
                        <div className={`custom-select__element type--${e.type} ${(e.key === currentKey) ? 'selected' : ''}`} key={idx} onClick={() => {
                            if (e.type === 'button') {
                                const res = onSelect?.(e.value, e.key);
                                if (res !== false) {
                                    setOpened(false);
                                }
                            }
                        }}>
                            {(e.iconUrl) && (
                                <img src={e.iconUrl} className="custom-select__icon" />
                            )}
                            <span className="custom-select__label">{e.label}</span>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}