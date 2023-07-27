import { ReactNode } from "react";

const Button = ({
    className,
    children,
    onClick,
    disabled,
}: {
    className?: string;
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
}): JSX.Element => {
    return (
        <button
            disabled={disabled}
            className={`px-2 py-0.5 text-lg rounded-lg text-white ${
                disabled ? "text-opacity-60 bg-neutral-600" : "text-opacity-100 bg-primary-600"
            } ${className || ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
