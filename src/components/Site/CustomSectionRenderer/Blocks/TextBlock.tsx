'use client';

interface TextBlockProps {
  id: string;
  props: {
    text?: string;
    align?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
  };
  isEditMode?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  updateBlocksData?: ((data: ((prev: any[]) => any[])) => void);
}

import { JsonArray } from "@prisma/client/runtime/client";
import "./Block.css";
import { ChangeEvent, InputEvent } from "react";

export default function TextBlock({
  id,
  props,
  isEditMode,
  isSelected,
  onClick,
  updateBlocksData
}: TextBlockProps) {
  const text = props.text /*|| 'Заголовок по умолчанию'*/;
  const textAlign = props.align || 'left';
  const color = props.color || "#720281";
  const backgroundColor = props.backgroundColor || "#fff";

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateBlocksData?.((p) => ([
      ...p.map(block => {
        if (block.id === id) return {
          ...block,
          props: {
            ...block.props,
            text: e.target.value,
          }
        };
        else return block;
      })
    ]))
  }

  return (
    <div
      onClick={onClick}
      className={`block-wrapper ${isEditMode ? 'block-wrapper--editable' : ''} ${isSelected ? 'block-wrapper--selected' : ''
        }`}
    >
      <p className="custom-text-block" style={{ textAlign, color, backgroundColor }}>
        {(isEditMode) ? (
          <textarea value={text} onChange={handleInputChange} style={{ textAlign, color, backgroundColor }} ></textarea>
        ) : text}
      </p>

      {isSelected && (
        <span className="block-wrapper__badge">Текстовый блок</span>
      )}
    </div>
  );
}