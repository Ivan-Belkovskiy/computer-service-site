'use client';

import { useState } from "react";
import "./AddBlockDropdown.css";

export type AddBlockDropdownElement = {
    type: "button";
    iconUrl?: string;
    label: string;
    onClick?: () => void;
} | {
    type: "text";
    iconUrl?: string;
    label: string;
    value: string;
}

export default function AddBlockDropdown({ elements, searchInput }: { elements: AddBlockDropdownElement[]; searchInput?: boolean; }) {

    const [filterText, setFilterText] = useState('');

    const filtered = elements.filter(el => {
        if (filterText.length === 0) return true;

        return el.label.includes(filterText);
    });

    return (
        <div className="add-block-dropdown">
            {(searchInput) && (<input
                type="text"
                className="add-block-dropdown__input"
                placeholder="Найти блок..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />)}
            <div className="add-block-dropdown__elements">
                {filtered.map(e => (
                    <div className="add-block-dropdown__element" onClick={() => {
                        if (e.type === 'button' && e.onClick) e.onClick();
                    }}>
                        {(e.iconUrl) && (
                            <img src={e.iconUrl} className="add-block-dropdown__icon" />
                        )}
                        <span className="add-block-dropdown__label">{e.label}</span>

                    </div>
                ))}
            </div>
        </div>
    )
}