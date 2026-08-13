'use client';

import Image from 'next/image';
import { ImageUploader } from '@/components/ControlPanel/ImageUploader/ImageUploader';
import './Block.css';

interface ImageBlockProps {
    id: string;
    props: {
        src?: string;
        alt?: string;
        align?: 'left' | 'center' | 'right';
        width?: string;
        borderRadius?: string;
        aspectRatio?: number;

        withTextbox?: boolean;
        textboxContent?: string;
    };
    isEditMode?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
    updateBlocksData?: (data: (prev: any[]) => any[]) => void;
}

export default function ImageBlock({
    id,
    props,
    isEditMode,
    isSelected,
    onClick,
    updateBlocksData,
}: ImageBlockProps) {
    const src = props.src || '';
    const alt = props.alt || '';
    const align = props.align || 'center';
    const width = props.width || '100%';
    const borderRadius = props.borderRadius || '8px';
    const aspectRatio = props.aspectRatio || 16 / 9;

    const updateProp = (key: string, value: any) => {
        updateBlocksData?.((prev) =>
            prev.map((block) => {
                if (block.id === id) {
                    return {
                        ...block,
                        props: {
                            ...block.props,
                            [key]: value,
                        },
                    };
                }
                return block;
            })
        );
    };

    return (
        <div
            onClick={onClick}
            className={`block-wrapper ${isEditMode ? 'block-wrapper--editable' : ''} ${isSelected ? 'block-wrapper--selected' : ''
                }`}
        >
            <div className="custom-image-block__main">
                {isEditMode ? (
                    <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-white flex flex-col gap-3">
                        <ImageUploader
                            value={src}
                            onChange={(newUrl) => updateProp('src', newUrl)}
                            label="Загрузить или изменить изображение"
                        />
                    </div>
                ) : null}

                {src ? (
                    <div
                        className={`custom-image-block__container`}
                        style={{ /*width: width,*/ maxWidth: '100%', justifyContent: align, flexDirection: (align === 'right') ? 'row-reverse' : 'row' }}
                    >
                        <div
                            className="relative w-full overflow-hidden"
                            style={{
                                aspectRatio: `${aspectRatio}`,
                                borderRadius: borderRadius,
                                width: width
                            }}
                        >
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                                className="object-cover"
                                onLoadingComplete={(img) => {
                                    if (img.naturalWidth && img.naturalHeight) {
                                        const realRatio = img.naturalWidth / img.naturalHeight;
                                        if (realRatio !== props.aspectRatio) {
                                            updateProp('aspectRatio', realRatio);
                                        }
                                    }
                                }}
                            />
                        </div>
                        {(props.withTextbox) ? <p className="custom-image-block__textbox">
                            {(isEditMode) ? (
                                <>
                                    <textarea className="custom-image-block__input" value={props.textboxContent} onChange={(e) => updateProp('textboxContent', e.target.value)}></textarea>
                                    <button className="custom-image-block__button" onClick={(e) => {
                                        e.stopPropagation();
                                        updateProp('withTextbox', false);
                                        // updateProp('textboxContent', '');
                                    }}>Отключить текст</button>
                                </>
                            ) : props.textboxContent}
                        </p> : (
                            (isEditMode) && <button className="custom-image-block__button" onClick={(e) => {
                                e.stopPropagation();
                                updateProp('withTextbox', true);
                            }}>Добавить текст</button>
                        )}
                    </div>
                ) : (
                    !isEditMode && (
                        <div className="p-4 text-center text-gray-400 italic bg-gray-50 rounded">
                            Изображение не выведено
                        </div>
                    )
                )}
            </div>

            {isSelected && <span className="block-wrapper__badge">Изображение</span>}
        </div>
    );
}