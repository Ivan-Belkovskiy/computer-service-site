'use client';

import { createContext, useContext, useState, useRef, ReactNode, useCallback } from "react";

interface ControlPanelContextType {
    sectionData: any;
    setSectionData: (data: any) => void;
    registerSaveHandler: (handler: (() => Promise<void> | void) | null) => void;
    triggerSave: () => Promise<void>;
    isSaving: boolean;
}

const ControlPanelContext = createContext<ControlPanelContextType | undefined>(undefined);

export function ControlPanelProvider({ children }: { children: ReactNode }) {
    const [sectionData, setSectionData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const saveHandlerRef = useRef<(() => Promise<void> | void) | null>(null);

    const registerSaveHandler = useCallback((handler: (() => Promise<void> | void) | null) => {
        saveHandlerRef.current = handler;
    }, []);

    const triggerSave = async () => {
        if (saveHandlerRef.current && !isSaving) {
            try {
                setIsSaving(true);
                await saveHandlerRef.current();
            } catch (error) {
                console.error("Ошибка при сохранении:", error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <ControlPanelContext.Provider value={{
            sectionData,
            setSectionData,
            registerSaveHandler,
            triggerSave,
            isSaving
        }}>
            {children}
        </ControlPanelContext.Provider>
    );
}

export function useControlPanel() {
    const context = useContext(ControlPanelContext);
    if (!context) {
        throw new Error("useControlPanel must be used within ControlPanelProvider");
    }
    return context;
}