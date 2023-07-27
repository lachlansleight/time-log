const TextField = ({
    className,
    label,
    value,
    onChange,
    onFocus,
    placeholder = "",
    type = "text",
}: {
    className?: string;
    label: string;
    value: string;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    placeholder?: string;
    type?: string;
}): JSX.Element => {
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
            />
        </div>
    );
};

export default TextField;
