'use client';

import { CSSProperties, useRef } from "react";

interface PhoneInputProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    style?: CSSProperties;
}

export default function PhoneInput({ value, onChange, className, placeholder, style }: PhoneInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const pattern = "+375(XX)XXX-XX-XX";

    
    const formatValue = (str: string): string => {
        let digits = str.replace(/\D/g, "");

        if (digits.length <= 3 && str.length < pattern.length) {
            if (digits === "375" || digits === "37" /*|| digits === "3"*/) return "";
        }

        if (digits.startsWith("375") && digits.length > 3) {
            digits = digits.slice(3);
        }

        let result = "";
        let digitIndex = 0;

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === "X") {
                if (digitIndex < digits.length) {
                    result += digits[digitIndex];
                    digitIndex++;
                } else {
                    break;
                }
            } else {
                result += pattern[i];
            }
        }

        return result;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;

        if (e.key === "Backspace") {
            const start = input.selectionStart;
            if (start && start > 0) {
                const charBeforeCursor = input.value[start - 1];
                if (/[()-]/.test(charBeforeCursor)) {
                    input.setSelectionRange(start - 1, start - 1);
                }
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatValue(e.target.value);
        onChange(formatted);
    };

    return (
        <input
            ref={inputRef}
            type="tel"
            className={`phone-input ${className}`}
            placeholder={placeholder || pattern}
            style={style}
            value={value}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
        />
    );
}