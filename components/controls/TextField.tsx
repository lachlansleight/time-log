import { useEffect, useRef } from "react";

const TextField = ({
    className,
    label,
    value,
    onChange,
    onFocus,
    placeholder = "",
    type = "text",
    autoFocus = false,
}: {
    className?: string;
    label: string;
    value: string;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    placeholder?: string;
    type?: string;
    autoFocus?: boolean;
}): JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!autoFocus) return;
        if (!inputRef.current) return;
        inputRef.current.focus();
    }, [autoFocus, inputRef]);

    return (
        <div className={`w-full flex flex-col ${className}`}>
            <label className="w-24 text-xs">{label}</label>
            <input
                type={type}
                className="flex-grow bg-neutral-700 rounded px-2 py-1"
                value={value}
                placeholder={placeholder}
                onChange={e => {
                    if (onChange) onChange(e.target.value);
                }}
                onFocus={onFocus}
                ref={inputRef}
            />
        </div>
    );
};

export default TextField;
