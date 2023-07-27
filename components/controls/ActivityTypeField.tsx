import { useMemo } from "react";
import ActivityType, { ClientActivityType } from "lib/types/ActivityType";
import AutocompleteField from "./AutocompleteField";

const ActivityTypeField = ({
    label = "Activity",
    value,
    onChange,
    types,
}: {
    label?: string;
    value: ClientActivityType;
    onChange: (newVal: ClientActivityType) => void;
    types: ClientActivityType[];
}): JSX.Element => {
    const autocompleteOptions = useMemo(() => {
        return types.map(g => ({ key: g.id, label: g.name }));
    }, [types]);

    return (
        <AutocompleteField
            label={label}
            value={types.find(t => t.id === value.id)?.id || -1}
            onChange={newVal => {
                if (newVal === -1) return;
                const newType = types.find(t => t.id === newVal);
                if(!newType) return;
                onChange(newType);
            }}
            onCustomChange={customVal => {
                onChange({
                    ...ActivityType.getDefault(),
                    id: new Date().valueOf().toString(),
                    name: customVal,
                })
            }}
            autocompleteOptions={autocompleteOptions}
        />
    );
};

export default ActivityTypeField;
