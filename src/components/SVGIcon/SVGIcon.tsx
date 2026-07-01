import Image from "next/image";
import { CSSProperties } from "react";

export default function SVGIcon({ className, imgSrc, width, height, style }: { className?: string, imgSrc: string, width: number, height: number, style?: CSSProperties }) {
    return (
        <Image
            className={className}
            style={{
                display: 'inline-block',
                userSelect: 'none',
                ...style
            }}
            width={width}
            height={height}
            src={imgSrc}
            alt="svg icon"
        />
    )
}