// КОМПОНЕНТ ТРЕБУЕТ ДОРАБОТКИ!

'use client';

import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import "./PopupNotification.css";

export type PopupNotificationType = "info" | "success" | "warning" | "error";

export interface PopupNotificationProps {
    position?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    }
    isActive?: boolean;
    // activateRef?: RefObject<(() => void) | null>
    children?: ReactNode;
    type?: PopupNotificationType;
    withCloseButton?: boolean;
}

export default function PopupNotification({ position, isActive, children, type = 'info', withCloseButton }: PopupNotificationProps) {

    const [active, setActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setActive(isActive ?? false);
        if (isActive === true) {
            timerRef.current = setTimeout(() => {
                setActive(false);
            }, 7000);
        }

        // return () => 
    }, [isActive]);

    return (
        <div className={`popup-notification type-${type} ${active ? 'active' : ''}`} style={{
            top: `${position?.top}px`,
            right: `${position?.right}px`,
            bottom: `${position?.bottom}px`,
            left: `${position?.left}px`,

        }}>
            <div className="popup-notification__display">{children}</div>
            {withCloseButton && (
                <button className="popup-notification__button close-btn"></button>
            )}
        </div>
    )
}