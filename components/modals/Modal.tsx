import { ReactNode, useEffect, useState } from "react";

const Modal = ({
    children,
    onBgClick,
}: {
    children: ReactNode;
    onBgClick?: () => void;
}): JSX.Element => {
    const [bgOpacity, setBgOpacity] = useState("bg-opacity-0");
    const [opacity, setOpacity] = useState("opacity-0");
    useEffect(() => {
        setBgOpacity("bg-opacity-5");
        setOpacity("opacity-100");
    }, []);

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-neutral bg-white ${bgOpacity} text-white grid place-items-center transition-all`}
            style={{
                width: "calc(100vw - 0.5rem)",
            }}
            onClick={() => {
                if (onBgClick) onBgClick();
            }}
        >
            <div className="w-full md:w-auto px-4 md:px-0">
                <div className={`bg-neutral-800 p-4 shadow-md rounded ${opacity} transition-all`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
