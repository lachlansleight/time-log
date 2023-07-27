import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { FaArrowDown, FaArrowUp, FaRegDotCircle } from "react-icons/fa";
import DateOffsetField from "./DateOffsetField";

dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);

const ComplexDateField = ({
    className,
    label,
    value,
    onChange,
}: {
    className?: string;
    label: string;
    value: Date;
    onChange?: (value: Date) => void;
}): JSX.Element => {
    const [startDate, setStartDate] = useState(dayjs(value).startOf("isoWeek").toDate());
    const [controlledByDateField, setControlledByDateField] = useState(false);
    const [textValue, setTextValue] = useState(
        dayjs(value).startOf("day").add(12, "hour").format("DD/MM/YYYY")
    );
    const isValid = useMemo(() => {
        return dayjs(textValue, "DD/MM/YYYY").startOf("day").add(12, "hour").isValid();
    }, [textValue]);

    useEffect(() => {
        if (!isValid) return;
        if (!onChange) return;
        const newVal = dayjs(textValue, "DD/MM/YYYY").startOf("day").add(12, "hour").toDate();
        if (newVal.valueOf() === value.valueOf()) return;
        onChange(newVal);
    }, [textValue, isValid, onChange, value]);

    // If we set the date from the textbox / day increment buttons, make sure that the new
    // date value is within range (i.e. force the week to update)
    useEffect(() => {
        if (!controlledByDateField) return;
        const d = dayjs(value);
        const maxD = dayjs(startDate).add(2, "week").add(1, "day");
        const minD = dayjs(startDate);
        if (d.isBefore(minD)) {
            setStartDate(d.startOf("isoWeek").toDate());
        } else if (d.isAfter(maxD)) {
            setStartDate(d.startOf("isoWeek").add(-2, "week").toDate());
        }
    }, [value, startDate, controlledByDateField]);

    const getHumanReadableOffset = (date: Date) => {
        const d = dayjs(date);
        if (d.isSame(dayjs(), "day")) return "Today";
        if (d.isSame(dayjs().add(1, "day"), "day")) return "Tomorrow";
        if (d.isSame(dayjs(), "isoWeek")) return "This " + d.format("dddd");
        if (d.isSame(dayjs().add(7, "day"), "isoWeek")) return "Next " + d.format("dddd");
        if (d.isSame(dayjs(), "year")) return d.format("dddd, Do MMMM");
        return d.format("Do MMMM YYYY");
    };

    return (
        <div className={`w-full flex flex-col ${className}`}>
            <label className="w-24 text-xs">{label}</label>
            <div className="flex gap-8 place-items-center border-t border-white border-opacity-10 pt-2 ">
                <div className="flex flex-col gap-2 select-none">
                    {/* Week rows */}
                    {Array.from({ length: 3 }).map((_, i) => {
                        const isNewMonth =
                            i === 0 ||
                            dayjs(startDate)
                                .add(i + 1, "week")
                                .add(-1, "day")
                                .month() !== dayjs(startDate).add(i, "week").add(-1, "day").month();
                        return (
                            <div key={i} className="flex gap-2 items-center">
                                {/* If ths week in this row contains the first of the month (or if it's the first row), show the month name */}
                                <span className="w-10">
                                    {isNewMonth
                                        ? dayjs(startDate)
                                              .add(i, "week")
                                              .add(6, "day")
                                              .format("MMM")
                                        : ""}
                                </span>

                                {/* Day cells */}
                                {Array.from({ length: 7 }).map((_, j) => {
                                    const d = dayjs(startDate).add(i, "week").add(j, "day");
                                    const isCur = dayjs(d).isSame(dayjs(value), "day");
                                    const isSat = dayjs(d).day() === 6;
                                    if (d.isBefore(dayjs(), "day")) {
                                        return (
                                            <div
                                                key={i + "_" + j}
                                                className={`w-8 h-8 text-lg grid place-items-center text-white rounded ${
                                                    isSat ? "ml-1.5" : "ml-0"
                                                } ${
                                                    isCur
                                                        ? "bg-neutral-700 bg-opacity-50 text-opacity-40 cursor-default"
                                                        : "bg-transparent text-opacity-20"
                                                }`}
                                            >
                                                {d.format("D")}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={i + "_" + j}
                                            className={`w-8 h-8 text-lg grid place-items-center border border-white rounded border-opacity-20 ${
                                                isSat ? "ml-1.5" : "ml-0"
                                            } ${
                                                isCur
                                                    ? "bg-neutral-700 cursor-default"
                                                    : "bg-transparent cursor-pointer"
                                            }`}
                                            onClick={() => {
                                                const newVal = d.startOf("day").add(12, "hour");
                                                setTextValue(newVal.format("DD/MM/YYYY"));
                                            }}
                                        >
                                            {d.format("D")}
                                        </div>
                                    );
                                })}

                                {/* Buttons - up arrow if row 1, down arrow if row 3, reset to today if row 2 */}
                                {i === 0 ? (
                                    dayjs(startDate).diff(dayjs(), "day") <= 0 ? (
                                        <div className="w-8 h-8 ml-1.5" />
                                    ) : (
                                        <div
                                            className={`w-8 h-8 text-lg grid place-items-center border border-white rounded border-opacity-20 cursor-pointer ml-1.5`}
                                            onClick={() => {
                                                const newVal = dayjs(startDate).add(-1, "week");
                                                setControlledByDateField(false);
                                                setStartDate(newVal.toDate());
                                            }}
                                        >
                                            <FaArrowUp />
                                        </div>
                                    )
                                ) : i === 2 ? (
                                    <div
                                        className={`w-8 h-8 text-lg grid place-items-center border border-white rounded border-opacity-20 cursor-pointer ml-1.5`}
                                        onClick={() => {
                                            const newVal = dayjs(startDate).add(1, "week");
                                            setControlledByDateField(false);
                                            setStartDate(newVal.toDate());
                                        }}
                                    >
                                        <FaArrowDown />
                                    </div>
                                ) : (
                                    <div
                                        className="w-8 h-8 text-lg grid place-items-center border border-white rounded border-opacity-20 cursor-pointer ml-1.5"
                                        onClick={() => {
                                            setTextValue(
                                                dayjs()
                                                    .startOf("day")
                                                    .add(12, "hour")
                                                    .format("DD/MM/YYYY")
                                            );
                                        }}
                                    >
                                        <FaRegDotCircle />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-4 flex-grow items-center">
                    {/* The normal date field for manual entry and day increments */}
                    <DateOffsetField
                        value={textValue}
                        onChange={t => {
                            setTextValue(t);
                            setControlledByDateField(true);
                        }}
                        className={className}
                    />

                    {/* Human-readable display :) */}
                    <span className="text-lg italic text-center leading-none">
                        Task is due{dayjs(value).diff(dayjs(), "week") < 2 ? "" : " on"}:<br />
                        {getHumanReadableOffset(value)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ComplexDateField;
