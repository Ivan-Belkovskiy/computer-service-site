'use client';

import React, { useState } from 'react';
import HeadingBlock from './Blocks/HeadingBlock';
// import TextBlock from './Blocks/TextBlock';
// import ButtonBlock from './Blocks/ButtonBlock';
// import ImageBlock from './Blocks/ImageBlock';
import './CustomSectionRenderer.css';
import AddBlockDropdown from '@/components/ControlPanel/Editor/CustomSectionEditor/AddBlockDropdown/AddBlockDropdown';
import TextBlock from './Blocks/TextBlock';
import ButtonsBlock from './Blocks/ButtonsBlock';
import ImageBlock from './Blocks/ImageBlock';
import SeparatorBlock from './Blocks/SeparatorBlock';

export interface BlockData {
    id: string;
    type: string;
    props: Record<string, any>;
}

interface CustomSectionRendererProps {
    content: BlockData[] | string | null;
    isEditMode?: boolean;
    selectedBlockId?: string | null;
    onSelectBlock?: (id: string) => void;
    onAddBlock?: (type: string) => void;

    updateBlocksData?: ((data: ((prev: any[]) => any[])) => void);
}

export default function CustomSectionRenderer({
    content,
    isEditMode = false,
    selectedBlockId,
    onSelectBlock,
    onAddBlock,
    updateBlocksData,
}: CustomSectionRendererProps) {
    const blocks: BlockData[] = React.useMemo(() => {
        if (!content) return [];
        if (typeof content === 'string') {
            try {
                return JSON.parse(content);
            } catch (e) {
                console.error("Ошибка парсинга content кастомной секции:", e);
                return [];
            }
        }
        return Array.isArray(content) ? content : [];
    }, [content]);

    const [isDropdownOpened, setDropdownOpened] = useState(false);


    const handleAddBlock = (type: string) => {
        onAddBlock?.(type);
        setDropdownOpened(false);
    }



    const renderAddButton = () => {
        if (isEditMode) return (
            <div className="custom-section__button-wrapper">
                <div className="custom-section__button-container">
                    <button
                        className={`custom-section__button add-button ${(isDropdownOpened ? 'dropdown-opened' : '')}`}
                        onClick={() => setDropdownOpened(p => !p)}
                    >Добавить блок</button>
                    {(isDropdownOpened) && <AddBlockDropdown
                        searchInput
                        elements={[
                            {
                                type: "button",
                                label: "Заголовок",
                                onClick: () => handleAddBlock('heading'),
                            },
                            {
                                type: "button",
                                label: "Текстовый блок",
                                onClick: () => handleAddBlock('text'),
                            },
                            {
                                type: "button",
                                label: "Список",
                            },
                            {
                                type: "button",
                                label: "Таблица",
                            },
                            {
                                type: "button",
                                label: "Изображение",
                                onClick: () => handleAddBlock('image'),
                            },
                            {
                                type: "button",
                                label: "Несколько изображений",
                            },
                            {
                                type: "button",
                                label: "Кнопки",
                                onClick: () => handleAddBlock('button'),
                            },
                            {
                                type: "button",
                                label: "Разделитель",
                                onClick: () => handleAddBlock('separator'),
                            },
                            // {
                            //     type: "button",
                            //     label: "123"
                            // }
                        ]}
                    />}
                </div>
            </div>
        );
    }

    if (blocks.length === 0) {
        return (
            <section className="custom-section custom-section--empty">
                {isEditMode ? (
                    <>
                        <p className="custom-section__placeholder">
                            Секция пуста. Нажмите «Добавить блок», чтобы начать сборку.
                        </p>
                        {renderAddButton()}
                    </>
                ) : null}
            </section>
        );
    }

    return (
        <section className={`custom-section ${isEditMode ? 'custom-section--edit-mode' : ''}`}>
            <div className="custom-section__container">
                {blocks.map((block) => {
                    const isSelected = isEditMode && selectedBlockId === block.id;

                    const blockProps = {
                        // key: block.id,
                        id: block.id,
                        props: block.props,
                        isEditMode,
                        isSelected,
                        onClick: () => isEditMode && onSelectBlock && onSelectBlock(block.id),
                        updateBlocksData,
                    };

                    switch (block.type) {
                        case 'heading':
                            return <HeadingBlock key={block.id} {...blockProps} />;
                        case 'text':
                            return <TextBlock key={block.id} {...blockProps} />;
                        case 'button':
                            return <ButtonsBlock key={block.id} {...blockProps} />;
                        case 'image':
                            return <ImageBlock key={block.id} {...blockProps} />;
                        case 'separator':
                            return <SeparatorBlock key={block.id} {...blockProps} />
                        default:
                            return (
                                <div key={block.id} className="unknown-block">
                                    Неизвестный блок: {block.type}
                                </div>
                            );
                    }
                })}
                {renderAddButton()}
            </div>
        </section>
    );
}