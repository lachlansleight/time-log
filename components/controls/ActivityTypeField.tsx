import { useMemo } from "react";
import ActivityType, { ClientActivityType } from "lib/types/ActivityType";
import AutocompleteField from "./AutocompleteField";

const ActivityTypeField = ({
    label = "Activity",
    value,
    onChange,
    types,
    autoFocus = false,
    onEnter,
}: {
    label?: string;
    value: ClientActivityType;
    onChange: (newVal: ClientActivityType) => void;
    types: ClientActivityType[];
    autoFocus?: boolean;
    onEnter?: () => void;
}): JSX.Element => {
    const autocompleteOptions = useMemo(() => {
        return types.filter(t => t.id !== "uncategorized").map(g => ({ key: g.id, label: g.name }));
    }, [types]);

    return (
        <AutocompleteField
            label={label}
            value={types.find(t => t.id === value.id)?.id || -1}
            onChange={newVal => {
                if (newVal === -1) return;
                const newType = types.find(t => t.id === newVal);
                if (!newType) return;
                onChange(newType);
            }}
            onCustomChange={customVal => {
                onChange({
                    ...ActivityType.getDefault(),
                    id: new Date().valueOf().toString(),
                    name: customVal,
                });
            }}
            onClear={() => {
                onChange(ActivityType.getDefault());
            }}
            autocompleteOptions={autocompleteOptions}
            placeholder="Uncategorized"
            autoFocus={autoFocus}
            onEnter={onEnter}
        />
    );
};

export default ActivityTypeField;
