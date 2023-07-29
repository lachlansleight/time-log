import { useCallback, useRef, useState } from "react";
import { ClientDay } from "lib/types/Day";
import { ClientActivity } from "lib/types/Activity";
import ActivityType from "lib/types/ActivityType";
import TextUtils from "lib/TextUtils";
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
    const [newActivity, setNewActivity] = useState<ClientActivity | null>(null);

    // const handleClick = useCallback(
    //     (e: React.MouseEvent) => {
    //         if (!columnDiv.current) return;
    //         if (loading.includes(date)) return;
    //         const rect = columnDiv.current.getBoundingClientRect();
    //         const y = e.clientY - rect.top;
    //         const hour = Math.round(getHour(y) * 2) / 2;
    //         handleActivityCreate({
    //             id: new Date().valueOf().toString(),
    //             type: ActivityType.getDefault(),
    //             start: hour,
    //             duration: 1,
    //         });
    //     },
    //     [columnDiv, loading]
    // );

    const [dragStartY, setDragStartY] = useState(0);
    const [lastOffset, setLastOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const dragStart = useCallback(
        (e: React.DragEvent) => {
            if (!columnDiv.current) return;
            if (loading.includes(date)) return;
            if (!dragImg.current) return;
            e.dataTransfer.setDragImage(dragImg.current, 0, 0);
            e.dataTransfer.effectAllowed = "all";
            const rect = columnDiv.current.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const hour = Math.round(getHour(y) * 2) / 2;
            setDragStartY(y);
            setLastOffset(0);
            setIsDragging(true);
            setNewActivity({
                id: new Date().valueOf().toString(),
                type: ActivityType.getDefault(),
                start: hour,
                duration: 0,
            });
        },
        [columnDiv, loading, getY, getHour, dragImg]
    );

    const dragMove = useCallback(
        (e: React.MouseEvent) => {
            if (!columnDiv.current) return;
            if (!newActivity) return;
            if (!isDragging) return;
            const rect = columnDiv.current.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const offset = y - dragStartY;
            if (Math.abs(offset - lastOffset) > 50) return;
            setLastOffset(offset);
            let hourOffset = Math.round(getHour(offset) * 2) / 2;
            if (hourOffset < 0) hourOffset = 0;
            if (newActivity.start + hourOffset > 24) hourOffset = 24 - newActivity.start;
            const newDuration = hourOffset;
            setNewActivity((cur: any) => ({
                ...cur,
                duration: newDuration,
            }));
        },
        [columnDiv, dragStartY, getY, getHour, newActivity]
    );

    const dragEnd = useCallback(() => {
        if (!newActivity) return;
        if (newActivity.duration > 0) {
            handleActivityCreate(JSON.parse(JSON.stringify(newActivity)));
        }
        setIsDragging(false);
        setNewActivity(null);
        setLastOffset(0);
    }, [newActivity, handleActivityCreate]);

    return (
        <div
            key={date}
            className={`relative h-full border-r border-white border-opacity-10 select-none ${
                loading.includes(date) ? "cursor-wait" : "cursor-pointer"
            }`}
            ref={columnDiv}
            onDragStart={dragStart}
            onDrag={dragMove}
            onDragEnd={dragEnd}
            draggable
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
            {newActivity && (
                <div
                    className={`absolute grid place-items-center rounded-lg border border-neutral-800 ${newActivity.type.category.class}`}
                    style={{
                        top: getY(newActivity.start),
                        height: getY(newActivity.duration),
                        width: "calc(100% - 0.5rem)",
                        left: "0.25rem",
                    }}
                >
                    <span className="text-xs text-white text-opacity-50 absolute left-0 w-full -top-5">
                        {TextUtils.getHourString(newActivity.start)}
                    </span>
                    <div className="flex flex-col items-center">
                        {newActivity.duration > 0 && <span>{newActivity.type.name}</span>}
                    </div>
                    <span className="text-xs text-white text-opacity-50 absolute left-0 w-full -bottom-5">
                        {TextUtils.getHourString(newActivity.start + newActivity.duration)}
                    </span>
                </div>
            )}
            <img className="absolute w-0 h-0" ref={dragImg} />
        </div>
    );
};

export default CalendarDayColumn;
