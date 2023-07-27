import { useMemo, useState } from "react";
import { FaSync } from "react-icons/fa";
import Button from "components/controls/Button";
import { ClientActivity } from "lib/types/Activity";
import ActivityType from "lib/types/ActivityType";
import ActivityTypeField from "components/controls/ActivityTypeField";
import useData from "lib/hooks/useData";
import CategoryField from "components/controls/CategoryField";
import TextField from "components/controls/TextField";

const ActivityForm = ({
    activity,
    onSubmit,
    loading = false,
    className = "",
}: {
    activity?: ClientActivity;
    onSubmit: (activity: ClientActivity) => void;
    loading?: boolean;
    className?: string;
}): JSX.Element => {
    const { data } = useData();
    const [value, setValue] = useState<ClientActivity>(
        activity || {
            id: new Date().valueOf().toString(),
            type: ActivityType.getDefault(),
            start: 0,
            duration: 1,
            note: "",
        }
    );
    const isNewActivityType = useMemo(() => {
        console.log(value.type);
        if(data?.activityTypes.find(t => t.id === value.type.id)) return false;
        return true;
    }, [data, value]);

    if (!data) {
        return (
            <div>
                <FaSync className="animate-spin text-4xl" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <ActivityTypeField
                label="Activity"
                value={value.type}
                onChange={v => setValue(cur => ({ 
                    ...cur, 
                    type: v
                }))}
                types={data.activityTypes}
            />
            <TextField
                label="Note"
                value={value.note || ""}
                onChange={v => setValue(cur => ({ ...cur, note: v }))}
            />
            {isNewActivityType ? (
                <CategoryField
                    label="Category"
                    value={value.type.category}
                    onChange={v => setValue(cur => ({
                        ...cur,
                        type: {
                            ...cur.type,
                            category: v
                        }
                    }))}
                    categories={data.categories}
                />
            ) : (
                <CategoryField
                    label="Category"
                    value={value.type.category}
                    onChange={v => setValue(cur => ({
                        ...cur,
                        type: {
                            ...cur.type,
                            category: v
                        }
                    }))}
                    categories={data.categories}
                />
            )}
            <Button
                className="grid place-items-center py-1 mt-4"
                onClick={() => {
                    if (loading) return;
                    onSubmit(value);
                }}
            >
                {loading ? (
                    <FaSync className="animate-spin my-[0.3rem]" />
                ) : activity ? (
                    "Update"
                ) : (
                    "Create"
                )}
            </Button>
        </div>
    );
};

export default ActivityForm;
