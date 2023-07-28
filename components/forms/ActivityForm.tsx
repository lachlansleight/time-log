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
    onDelete,
    loading = false,
    className = "",
}: {
    activity?: ClientActivity;
    onSubmit: (activity: ClientActivity) => void;
    onDelete: (activity: ClientActivity) => void;
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
        if (data?.activityTypes.find(t => t.id === value.type.id)) return false;
        return true;
    }, [data, value]);
    const [isEditingActivity, setIsEditingActivity] = useState(false);

    if (!data) {
        return (
            <div>
                <FaSync className="animate-spin text-4xl" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {isEditingActivity ? (
                <>
                    <h2 className="text-2xl">Editing Activity Type: {value.type.name}</h2>
                    <TextField
                        label="Name"
                        value={value.type.name}
                        onChange={v =>
                            setValue(cur => ({
                                ...cur,
                                type: {
                                    ...cur.type,
                                    name: v,
                                },
                            }))
                        }
                    />
                    {value.type.category.id !== "uncategorized" && (
                        <CategoryField
                            label="Category"
                            value={value.type.category}
                            onChange={v =>
                                setValue(cur => ({
                                    ...cur,
                                    type: {
                                        ...cur.type,
                                        category: v,
                                    },
                                }))
                            }
                            categories={data.categories}
                            editSource={value.type.category}
                        />
                    )}
                    <div className="flex gap-4">
                        <Button
                            className="grid place-items-center py-1 mt-4 w-36 bg-opacity-50"
                            onClick={() => {
                                setIsEditingActivity(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="grid place-items-center py-1 mt-4 flex-grow"
                            onClick={() => {
                                if (loading) return;
                                onSubmit(value);
                            }}
                        >
                            Save Activity Type
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex gap-4 items-end">
                        <ActivityTypeField
                            label="Activity"
                            value={value.type}
                            onChange={v =>
                                setValue(cur => ({
                                    ...cur,
                                    type: v,
                                }))
                            }
                            types={data.activityTypes}
                            autoFocus={true}
                            onEnter={() => onSubmit(value)}
                        />
                        {!isNewActivityType && value.type.id !== "uncategorized" && (
                            <Button className="h-8" onClick={() => setIsEditingActivity(true)}>
                                Edit
                            </Button>
                        )}
                    </div>
                    <TextField
                        label="Note"
                        value={value.note || ""}
                        onChange={v => setValue(cur => ({ ...cur, note: v }))}
                    />
                    {isNewActivityType && (
                        <CategoryField
                            label="Category"
                            value={value.type.category}
                            onChange={v =>
                                setValue(cur => ({
                                    ...cur,
                                    type: {
                                        ...cur.type,
                                        category: v,
                                    },
                                }))
                            }
                            categories={data.categories}
                        />
                    )}
                    <div className="flex gap-4">
                        <Button
                            className="grid place-items-center py-1 mt-4 w-36 bg-opacity-50"
                            onClick={() => {
                                if (loading) return;
                                onDelete(value);
                            }}
                        >
                            Delete
                        </Button>
                        <Button
                            className="grid place-items-center py-1 mt-4 flex-grow"
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
                </>
            )}
        </div>
    );
};

export default ActivityForm;
