import { useCallback, useRef } from "react";
import { ClientDay } from "lib/types/Day";
import { ClientActivity } from "lib/types/Activity";
import ActivityType from "lib/types/ActivityType";
import CalendarActivity from "./CalendarActivity";

const CalendarDayColumn = ({
    date,
    data,
    getY,
    getHour,
    loading,
    handleActivityChange,
    handleActivityCreate,
    handleActivityOpen,
}: {
    date: string;
    data: ClientDay[];
    getY: (time: number) => number;
    getHour: (time: number) => number;
    loading: string[];
    handleActivityChange: (newVal: ClientActivity) => void;
    handleActivityCreate: (newVal: ClientActivity) => void;
    handleActivityOpen: (activity: ClientActivity) => void;
}): JSX.Element => {
    const columnDiv = useRef<HTMLDivElement>(null);
    const dragImg = useRef<HTMLImageElement>(null);
    //todo: I wanna be able to click + drag to create events, not default to one hour long
    //const [newActivity, setNewActivity] = useState<ClientActivity | null>(null);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (!columnDiv.current) return;
            if (loading.includes(date)) return;
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
            key={date}
            className={`relative h-full border-r border-white border-opacity-10 select-none ${
                loading.includes(date) ? "cursor-wait" : "cursor-pointer"
            }`}
            ref={columnDiv}
            onClick={handleClick}
        >
            {data
                .find(d => d.date === date)
                ?.activities.map((activity, i) => {
                    return (
                        <CalendarActivity
                            key={i}
                            activity={activity}
                            getY={getY}
                            getHour={getHour}
                            onChange={handleActivityChange}
                            onMiddleClick={() => handleActivityOpen(activity)}
                            loading={loading.includes(activity.id)}
                        />
                    );
                }) || <></>}
            <img className="absolute w-0 h-0" ref={dragImg} />
        </div>
    );
};

export default CalendarDayColumn;
