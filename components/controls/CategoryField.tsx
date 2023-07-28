import { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import Category, { ClientCategory } from "lib/types/Category";
import TextField from "./TextField";

const CategoryField = ({
    label = "Category",
    className = "",
    value,
    onChange,
    categories,
    editSource,
}: {
    label?: string;
    className?: string;
    value: ClientCategory;
    onChange: (newVal: ClientCategory) => void;
    categories: ClientCategory[];
    editSource?: ClientCategory;
}): JSX.Element => {
    const [isCreatingNew, setIsCreatingNew] = useState(!!editSource);
    const [customValue, setCustomValue] = useState<ClientCategory>(
        editSource || {
            ...Category.getDefault(),
            id: new Date().valueOf().toString(),
            name: "New Category",
        }
    );
    useEffect(() => {
        if (!isCreatingNew) return;
        onChange(customValue);
    }, [customValue, isCreatingNew]);

    return (
        <div className={`w-full flex flex-col ${className}`}>
            {isCreatingNew ? (
                <div className="flex justify-between items-center">
                    <label className="w-48 text-base">New Category</label>
                    <FaTimes
                        onClick={() => {
                            setIsCreatingNew(false);
                            onChange(Category.getDefault());
                        }}
                        className="cursor-pointer text-xl"
                    />
                </div>
            ) : (
                <label className="w-24 text-xs">{label}</label>
            )}
            {isCreatingNew ? (
                <div className="flex flex-col flex-grow gap-2">
                    <TextField
                        label="Name"
                        value={customValue.name}
                        onChange={v => setCustomValue(cur => ({ ...cur, name: v }))}
                    />
                    <TextField
                        label="Class"
                        value={customValue.class}
                        onChange={v => setCustomValue(cur => ({ ...cur, class: v }))}
                        placeholder="bg-neutral-700"
                    />
                    <TextField
                        label="Preview Class"
                        value={customValue.previewClass}
                        onChange={v => setCustomValue(cur => ({ ...cur, previewClass: v }))}
                        placeholder="bg-neutral-700"
                    />
                    <div className="flex gap-4 justify-center pt-6">
                        <div
                            className={`w-72 h-12 grid place-items-center rounded-lg ${customValue.class}`}
                        >
                            <span>Example Activity</span>
                        </div>
                        <div
                            key={customValue.id}
                            className="flex flex-col items-center cursor-pointer"
                        >
                            <div
                                className={`w-8 h-8 rounded-full border border-white ${customValue.previewClass}`}
                            />
                            <span>{customValue.name}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2 pt-4">
                    {categories.map(c => (
                        <div
                            key={c.id}
                            className={`flex flex-col items-center cursor-pointer px-3 pt-1 ${
                                c.id === value.id ? "border border-white rounded" : ""
                            }`}
                            onClick={() => onChange(c)}
                        >
                            <div
                                className={`w-8 h-8 rounded-full border border-white ${c.previewClass}`}
                            />
                            <span>{c.name}</span>
                        </div>
                    ))}
                    <div
                        className="flex flex-col items-center cursor-pointer pt-1"
                        onClick={() => setIsCreatingNew(true)}
                    >
                        <div className="w-8 h-8 grid place-items-center text-lg rounded-full border border-white">
                            <FaPlus className="text-xl" />
                        </div>
                        <span>Create New</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryField;
