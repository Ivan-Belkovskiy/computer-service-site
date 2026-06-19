import Image from "next/image";
import { CSSProperties } from "react";

export default function SVGIcon({ imgSrc, width, height, style }: { imgSrc: string, width: number, height: number, style?: CSSProperties }) {
    return (
        <Image
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