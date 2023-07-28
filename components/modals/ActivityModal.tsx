import { create, useModal } from "@ebay/nice-modal-react";
import useKeyboard from "lib/hooks/useKeyboard";
import { ClientActivity } from "lib/types/Activity";
import ActivityForm from "components/forms/ActivityForm";
import Modal from "./Modal";

const ActivityModal = create(
    ({
        activity,
        onChange,
    }: {
        activity?: ClientActivity;
        onChange: (activity: ClientActivity) => void;
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
                    <ActivityForm
                        activity={activity}
                        onSubmit={v => {
                            onChange(v);
                            modal.remove();
                        }}
                        loading={false}
                    />
                </div>
            </Modal>
        );
    }
);

export default ActivityModal;
