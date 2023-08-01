import { create, useModal } from "@ebay/nice-modal-react";
import useKeyboard from "lib/hooks/useKeyboard";
import LoginForm from "components/forms/LoginForm";
import { FbUser } from "lib/auth/useAuth";
import Modal from "./Modal";

const LoginModal = create(
    ({
        user,
        onSubmit,
    }: {
        user?: FbUser;
        onSubmit: (email: string, password: string) => void;
    }) => {
        const modal = useModal();

        useKeyboard(e => {
            if (e.key === "Escape") modal.remove();
        }, []);

        return (
            <Modal
                onBgClick={() => {
                    modal.remove();
                }}
            >
                <div onClick={e => e.stopPropagation()} className="w-auto lg:w-[50vw]">
                    <LoginForm user={user} onSubmit={onSubmit} />
                </div>
            </Modal>
        );
    }
);

export default LoginModal;
