import { useCallback, useEffect, useMemo, useState } from "react";

import { matchSorter } from "match-sorter";
import useKeyboard from "lib/hooks/useKeyboard";
import TextField from "./TextField";

export type AutocompleteOption = {
    key: number | string;
    label: string;
};

const AutocompleteField = ({
    className = "",
    dropdownClassName = "",
    label,
    value,
    autocompleteOptions,
    onChange,
    onCustomChange,
}: {
    className?: string;
    dropdownClassName?: string;
    label?: string;
    value: number | string;
    autocompleteOptions: AutocompleteOption[];
    onChange?: (newVal: number | string) => void;
    onCustomChange?: (newVal: string) => void;
}): JSX.Element => {
    const [inputValue, setInputValue] = useState(
        autocompleteOptions.find(o => o.key === value)?.label || ""
    );
    const [isOpen, setIsOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState(value || "");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const options = useMemo(() => {
        if (!inputValue) return [];
        return matchSorter(autocompleteOptions, inputValue || "", {
            keys: ["label"],
        });
    }, [inputValue, autocompleteOptions]);

    useKeyboard(
        (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "ArrowUp") {
                if (highlightedIndex > 0) setHighlightedIndex(cur => cur - 1);
                e.preventDefault();
            } else if (e.key === "ArrowDown") {
                if (highlightedIndex < options.length - 1) setHighlightedIndex(cur => cur + 1);
                e.preventDefault();
            } else if (e.key === "Enter") {
                setSelectedKey(
                    highlightedIndex === -1 ? "" : (options[highlightedIndex].key as string)
                );
                setIsOpen(false);
                e.preventDefault();
            }
        },
        [isOpen, options, highlightedIndex]
    );

    useEffect(() => {
        if (!inputValue) {
            setSelectedKey("");
            if (onChange) onChange(-1);
            return;
        }
        let set = false;
        let newOpen = true;
        options.forEach(option => {
            if (option.label === inputValue) {
                if (onChange) onChange(option.key);
                set = true;
                if (options.length === 1) {
                    //if there's only one option and it matches exactly,
                    //we can probably just close the popup list
                    newOpen = false;
                }
            }
        });
        setIsOpen(newOpen);
        if (!set) {
            if (onChange) onChange(-1);
            if (onCustomChange) onCustomChange(inputValue);
            setSelectedKey("");
        }
    }, [inputValue, options]);

    useEffect(() => {
        if (!isOpen) setHighlightedIndex(-1);
    }, [isOpen]);

    useEffect(() => {
        if (selectedKey === "") return;
        if (options.length === 0) {
            if (onChange) onChange(-1);
            return;
        }
        const option = autocompleteOptions.find(o => o.key === selectedKey);
        if (!option) {
            if (onChange) onChange(-1);
            return;
        }

        console.log({ selectedKey, option, autocompleteOptions, options });

        setInputValue(option.label);
        if (onChange) onChange(option.key);
        //setInputValue(options[selectedIndex].label);
        //if (onChange) onChange(options[selectedIndex].key);
    }, [selectedKey, options]);

    const getListItems = useCallback(() => {
        return options
            .map((option, index) => {
                return (
                    <li
                        key={option.key}
                        className={
                            "text-lg px-2 cursor-pointer " +
                            (index === highlightedIndex ? " bg-neutral-700" : "") +
                            (value === option.key
                                ? " bg-white bg-opacity-20 text-yellow-200 font-semibold"
                                : "")
                        }
                        onMouseDown={() => {
                            setSelectedKey(option.key as string);
                            setIsOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                    >
                        {option.label}
                    </li>
                );
            })
            .slice(0, 10);
    }, [options, value, highlightedIndex]);

    return (
        <div onBlur={() => setIsOpen(false)} className="flex-grow">
            <TextField
                label={label || ""}
                value={inputValue}
                onChange={setInputValue}
                className={`${className} ${
                    isOpen && getListItems().length > 0 ? " rounded-b-none border-b-0" : ""
                }`}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
                <ul
                    className={`option-dropdown bg-neutral-900 border-l border-r relative border-neutral-400 mb-5 select-none ${dropdownClassName} ${
                        isOpen && getListItems().length > 0
                            ? " border-l border-r border-b border-neutral-400 rounded rounded-t-none"
                            : ""
                    }`}
                    style={{
                        marginTop: "0rem",
                    }}
                >
                    {getListItems()}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteField;
