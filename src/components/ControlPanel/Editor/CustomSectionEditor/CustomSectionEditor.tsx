'use client';

import { CustomSection } from "@/app/controlpanel/(protected)/editor/page";
import CustomSectionRenderer from "@/components/Site/CustomSectionRenderer/CustomSectionRenderer";
import { useEffect, useState, useCallback } from "react";
import { v4 } from 'uuid';
import { useControlPanel } from "@/context/ControlPanelContext";

import "./CustomSectionEditor.css";
import SidePanelBlockProps from "./SidePanelBlockProps/SidePanelBlockProps";
import { updateCustomSection } from "@/app/actions/custom-sections";

export default function CustomSectionEditor({ sectionData }: { sectionData: CustomSection }) {
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [data, setData] = useState<CustomSection | null>(null);

    const { setSectionData, registerSaveHandler } = useControlPanel();

    useEffect(() => {
        setData(sectionData);
        setSectionData(sectionData);
    }, [sectionData, setSectionData]);

    const handleSave = useCallback(async () => {
        if (!data) return;

        try {
            
            const res = await updateCustomSection(data.id, data);
            // const res = await fetch(`/api/custom-sections/${data.id}`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ content: data.content }),
            // });

            if (res.success && res.updated) {
                setData(res.updated);
                alert('Данные сохранены!');
            }
            else {
                throw new Error('Ошибка сохранения!');
            }
            
        } catch (err) {
            console.error(err);
            alert('Ошибка при сохранении данных');
        }
    }, [data]);

    useEffect(() => {
        registerSaveHandler(handleSave);
        
        return () => registerSaveHandler(null);
    }, [data, handleSave, registerSaveHandler]);

    const updateBlocksData = (dataFn: (prev: any[]) => any[]) => {
        setData(p => {
            if (p) {
                const oldContent = Array.isArray(p.content) ? p.content : [];
                return {
                    ...p,
                    content: [...dataFn(oldContent)],
                };
            }
            return null;
        });
    };

    const onAddBlock = (type: string) => {
        let props: Record<string, any> = {};
        if (type === 'heading' || type === 'text') {
            props = {
                align: 'left',
                text: (type === 'heading') ? "Заголовок" : "Текстовый блок...",

            };
            if (type === 'heading') props.level = 'h1';
        }
        if (type === 'button') {
            props.buttons = [
                {
                    text: "Кнопка",
                    linkUrl: "#"
                }
            ];
        }

        if (type === 'separator') {
            props = {
                width: '100%',
                
            }
        }

        setData(p => {
            if (p) {
                const oldContent = Array.isArray(p.content) ? p.content : [];
                return {
                    ...p,
                    content: [
                        ...oldContent,
                        {
                            id: v4(),
                            type,
                            props
                            // props: {
                            //     align: "left",
                            //     level: "h1",
                            //     text: (type === 'heading') ? "Заголовок" : "Текстовый блок...",
                            // }
                        }
                    ],
                };
            }
            return null;
        });
    };

    const onDeleteBlock = (id: string) => {
        updateBlocksData(p => [
            ...p.filter(block => block.id !== id)
        ]);
        setActiveBlockId(null);
    }

    const handleDeselect = () => {
        setActiveBlockId(null);
    };

    const blocks = Array.isArray(data?.content) ? data?.content : [];
    const selectedBlock: any = blocks.find((b: any) => b.id === activeBlockId);

    if (data) return (
        <div className="custom-section-editor">
            <div
                className="editor-workspace__canvas"
                onClick={handleDeselect}
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <CustomSectionRenderer
                        content={data.content as any}
                        isEditMode={true}
                        onSelectBlock={setActiveBlockId}
                        onAddBlock={onAddBlock}
                        selectedBlockId={activeBlockId}
                        updateBlocksData={updateBlocksData}
                    />
                </div>
            </div>

            <aside className={`editor-workspace__sidebar ${activeBlockId ? 'is-open' : ''}`}>
                <div className="editor-workspace__sidebar-inner">
                    <div className="editor-sidepanel-header">
                        <h3>Настройки блока</h3>
                        <button
                            type="button"
                            className="editor-workspace__close-btn"
                            onClick={handleDeselect}
                            title="Закрыть панель"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="editor-sidepanel-content">
                        <SidePanelBlockProps blockData={selectedBlock} updateBlocksData={updateBlocksData} onDeleteBlock={onDeleteBlock} />
                    </div>
                </div>
            </aside>
        </div>
    );

    return null;
}