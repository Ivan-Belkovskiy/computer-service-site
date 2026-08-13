'use client';

interface HeadingBlockProps {
  id: string;
  props: {
    text?: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4';
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

export default function HeadingBlock({
  id,
  props,
  isEditMode,
  isSelected,
  onClick,
  updateBlocksData
}: HeadingBlockProps) {
  const Tag = props.level || 'h2';
  const text = props.text /*|| 'Заголовок по умолчанию'*/;
  const textAlign = props.align || 'left';
  const color = props.color || "#720281";
  const backgroundColor = props.backgroundColor || "#fff";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      className={`block-wrapper ${isEditMode ? 'block-wrapper--editable' : ''} ${
        isSelected ? 'block-wrapper--selected' : ''
      }`}
    >
      <Tag className="custom-heading" style={{ textAlign, color, backgroundColor }}>
        {(isEditMode) ? (
          <input type="text" value={text} onChange={handleInputChange} style={{ textAlign, color, backgroundColor }} />
        ) : text}
      </Tag>

      {isSelected && (
        <span className="block-wrapper__badge">Заголовок ({Tag})</span>
      )}
    </div>
  );
}