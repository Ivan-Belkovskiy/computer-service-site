'use client';

interface SeparatorBlockProps {
    id: string;
    props: {
        width?: string;
        height?: number;
        backgroundColor?: string;
        color?: string;
        borderRadius?: number;
    };
    isEditMode?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
    updateBlocksData?: ((data: ((prev: any[]) => any[])) => void);
}

import { JsonArray } from "@prisma/client/runtime/client";
import "./Block.css";
import { ChangeEvent, InputEvent } from "react";

export default function SeparatorBlock({
    id,
    props,
    isEditMode,
    isSelected,
    onClick,
    updateBlocksData
}: SeparatorBlockProps) {
    //   const textAlign = props.align || 'left';
    const width = props.width || '100%';
    const height = `${props.height || 2}px`;
    const color = props.color || "#fff";
    const backgroundColor = props.backgroundColor || "#720281";
    const borderRadius = `${props.borderRadius}px` || 0;


    return (
        <div
            onClick={onClick}
            className={`block-wrapper ${isEditMode ? 'block-wrapper--editable' : ''} ${isSelected ? 'block-wrapper--selected' : ''
                }`}
        >
            <div className="custom-separator-block">
                <hr className="custom-separator-block__separator" style={{ width, height, color, backgroundColor, borderRadius }} />
            </div>

            {isSelected && (
                <span className="block-wrapper__badge">Разделитель</span>
            )}
        </div>
    );
}