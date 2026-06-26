'use client';

import { useEffect, useState } from "react";
import "./MainInfoEditor.css";
import { Metadata } from "next";
// import { metadata } from "@/app/layout";
import { loadMetadata, saveMetadata } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function MainInfoEditor() {

    const router = useRouter();

    const [editingData, setEditingData] = useState<Metadata | null>(null);
    const [isUploading, setUploading] = useState(false);

    const uploadData = async () => {
        try {
            if (!editingData) return;

            setUploading(true);
            const res = await saveMetadata(editingData);


            setUploading(false);
        } catch (error) {

        }
    }

    const loadInfo = async () => {
        try {
            const data = await loadMetadata();
            setEditingData(data?.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        loadInfo();
    }, []);

    return (
        <div className="main-info-editor">
            <h1 className="main-info-editor__title">Основная информация</h1>
            <div className="main-info-editor__content">
                <div className="main-info-editor__block">
                    <span className="main-info-editor__label">Название сайта:</span>
                    <input type="text" className="main-info-editor__input" value={(editingData?.title || "") as string} onChange={(e) => setEditingData({
                        ...editingData,
                        title: e.target.value,
                    })} />
                </div>
                <div className="main-info-editor__block">
                    <span className="main-info-editor__label">Описание сайта:</span>
                    <textarea className="main-info-editor__input" value={editingData?.description || ""} onChange={(e) => setEditingData({
                        ...editingData,
                        description: e.target.value,
                    })}></textarea>
                </div>
            </div>
            <div className="main-info-editor__buttons">
                <button
                    className="main-info-editor__button"
                    onClick={uploadData}
                    disabled={isUploading}
                >Обновить информацию</button>
            </div>
        </div>
    )
}