'use client';

import { CSSProperties, Dispatch, SetStateAction } from "react";
import "./ExpandableSidePanel.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ExpandableSidePanelElement {
    type?: "link";
    content?: string;
    url: string;
    style?: CSSProperties;
}

export default function ExpandableSidePanel({ mobileOnly, isExpanded, setExpanded, elements }: { isExpanded?: boolean; setExpanded?: Dispatch<SetStateAction<boolean>>; mobileOnly?: boolean; elements?: ExpandableSidePanelElement[] }) {

    const router = useRouter();
    

    return (
        <div className={`expandable-sidepanel__overlay ${mobileOnly ? '--mobile-only' : ''} ${isExpanded ? 'expanded' : ''}`}>
            <ul className="expandable-sidepanel">
                {elements?.map((el, i) => (
                    <li className="expandable-sidepanel__element" key={i}>
                        {(!el.type || el.type === 'link') ? (
                            <Link href={el.url} onClick={() => setExpanded?.(false)}>{el.content}</Link>
                        ) : <></>}
                    </li>
                ))}
            </ul>
        </div>
    );
}