import { useCallback, useRef } from "react";
import { ClientDay } from "lib/types/Day";
import { ClientActivity } from "lib/types/Activity";
import ActivityType from "lib/types/ActivityType";
import CalendarActivity from "./CalendarActivity";

const CalendarDayColumn = ({
    day,
    data,
    getY,
    getHour,
    loading,
    handleActivityChange,
    handleActivityCreate,
}: {
    day: string;
    data: ClientDay[];
    getY: (time: number) => number;
    getHour: (time: number) => number;
    loading: string[];
    handleActivityChange: (newVal: ClientActivity) => void;
    handleActivityCreate: (newVal: ClientActivity) => void;
}): JSX.Element => {
    const columnDiv = useRef<HTMLDivElement>(null);
    const dragImg = useRef<HTMLImageElement>(null);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (!columnDiv.current) return;
            if (loading.includes(day)) return;
            const rect = columnDiv.current.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const hour = Math.round(getHour(y) * 2) / 2;
            handleActivityCreate({
                id: new Date().valueOf().toString(),
                type: ActivityType.getDefault(),
                start: hour,
                duration: 1,
            });
        },
        [columnDiv, loading]
    );

    return (
        <div
            key={day}
            className={`relative h-full border-r border-white border-opacity-10 select-none ${
                loading.includes(day) ? "cursor-wait" : "cursor-pointer"
            }`}
            ref={columnDiv}
            onClick={handleClick}
        >
            {data
                .find(d => d.date === day)
                ?.activities.map((activity, i) => {
                    return (
                        <CalendarActivity
                            key={i}
                            activity={activity}
                            getY={getY}
                            getHour={getHour}
                            onChange={handleActivityChange}
                            loading={loading.includes(activity.id)}
                        />
                    );
                }) || <></>}
            <img className="absolute w-0 h-0" ref={dragImg} />
        </div>
    );
};

export default CalendarDayColumn;
