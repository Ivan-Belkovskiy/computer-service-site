'use client';

interface ButtonsBlockButton {
    text: string;
    linkUrl: string | null;

}

interface ButtonsBlockProps {
    id: string;
    props: {
        buttons?: ButtonsBlockButton[];
    };
    isEditMode?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
    updateBlocksData?: ((data: ((prev: any[]) => any[])) => void);
}

import { JsonArray } from "@prisma/client/runtime/client";
import "./Block.css";
import { ChangeEvent, InputEvent, useState } from "react";
import Link from "next/link";

export default function ButtonsBlock({
    id,
    props,
    isEditMode,
    isSelected,
    onClick,
    updateBlocksData
}: ButtonsBlockProps) {

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, buttonIdx: number) => {
        updateBlocksData?.((p) => ([
            ...p.map(block => {
                if (block.id === id) return {
                    ...block,
                    props: {
                        ...block.props,
                        buttons: block.props.buttons?.map((btn: any, i: number) => i === buttonIdx ? {
                            ...btn,
                            text: e.target.value,
                        } : btn) || []
                    }
                };
                else return block;
            })
        ]));
    }

    const handleAddButton = () => {
        updateBlocksData?.((p) => ([
            ...p.map(block => {
                if (block.id === id) return {
                    ...block,
                    props: {
                        ...block.props,
                        buttons: [
                            ...(block.props.buttons || []),
                            {
                                text: `Кнопка ${block.props.buttons?.length || 0}`,
                                linkUrl: null,
                            }
                        ]
                    }
                };
                else return block;
            })
        ]));
    }

    const handleEditLink = (btnIdx: number, newValue?: string | null) => {
        const newUrl = (newValue) ? newValue : window.prompt('Введите URL');

        /*if (newUrl && newUrl.length > 0)*/ updateBlocksData?.((p) => ([
            ...p.map(block => {
                if (block.id === id) return {
                    ...block,
                    props: {
                        ...block.props,
                        buttons: block.props.buttons?.map((btn: any, i: any) => (i === btnIdx) ? {
                            ...btn,
                            linkUrl: newUrl || null,
                        } : btn) || [],
                    }
                };
                else return block;
            })
        ]));
    }

    const handleDeleteButton = (btnIdx: number) => {
        updateBlocksData?.((p) => ([
            ...p.map(block => {
                if (block.id === id) return {
                    ...block,
                    props: {
                        ...block.props,
                        buttons: block.props.buttons?.filter((btn: any, i: any) => (i !== btnIdx)) || [],
                    }
                };
                else return block;
            })
        ]));
    }

    const [textInputFocused, setTextInputFocused] = useState(false);
    const [urlInputFocused, setUrlInputFocused] = useState<number | null>(null);

    return (
        <div
            onClick={onClick}
            className={`block-wrapper ${isEditMode ? 'block-wrapper--editable' : ''} ${isSelected ? 'block-wrapper--selected' : ''
                }`}
        >
            <div className="custom-buttons-block" /* style={{ color, backgroundColor }} */>
                {props.buttons?.map((btn, idx) => {
                    const Tag = (isEditMode || !btn.linkUrl) ? 'button' : Link;
                    
                    return (
                        <Tag href={btn.linkUrl || ""} className={`custom-buttons-block__button`}>
                            {(isEditMode) ? (
                                <>
                                    <input
                                        className="custom-buttons-block__input"
                                        type="text"
                                        value={btn.text}
                                        onFocus={() => setTextInputFocused(true)}
                                        onBlur={() => setTextInputFocused(false)}
                                        onChange={(e) => handleInputChange(e, idx)}
                                    />
                                    {(!textInputFocused) && <div className="custom-buttons-block__control-buttons">
                                        {((isEditMode && (props.buttons?.length || 0) > 1)) && <div className={`custom-buttons-block__edit-button-container ${(urlInputFocused === idx) ? 'active-input' : ''}`} onClick={(e) => {
                                            e.stopPropagation();
                                            // handleEditLink(idx);
                                        }}>
                                            <span className="custom-buttons-block__edit-button">🔗</span>
                                            <div className="custom-buttons-block__infobox">
                                                <input
                                                    type="text"
                                                    value={btn.linkUrl || ""}
                                                    onChange={(e) => handleEditLink(idx, (e.target.value.length === 0) ? null : e.target.value)}
                                                    onFocus={() => setUrlInputFocused(idx)}
                                                    onBlur={() => setUrlInputFocused(null)}
                                                />
                                            </div>
                                        </div>}
                                        {((isEditMode && (props.buttons?.length || 0) > 1)) && <span className="custom-buttons-block__delete-button" onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteButton(idx);
                                        }}>⨉</span>}
                                    </div>}
                                </>
                            ) : btn.text}
                        </Tag>
                    );
                })}
                {(/*isSelected &&*/ (isEditMode && (props.buttons?.length || 0) < 5)) && <button className={`custom-buttons-block__button create-btn ${(
                    ((props.buttons?.length || 0) > 4) ? (
                        ((props.buttons?.length || 0) > 7) ? "no-text" : "short-text"
                    ) : ""
                )}`} onClick={(e) => {
                    e.stopPropagation();
                    handleAddButton();
                }}>+</button>}
            </div>

            {isSelected && (
                <span className="block-wrapper__badge">Текстовый блок</span>
            )}
        </div>
    );
}