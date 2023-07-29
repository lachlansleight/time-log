import { useCallback, useEffect, useRef, useState } from "react";
import { ClientActivity } from "lib/types/Activity";

const CalendarActivity = ({
    activity,
    getY,
    getHour,
    onChange,
    onMiddleClick,
    loading,
}: {
    activity: ClientActivity;
    getY: (time: number) => number;
    getHour: (time: number) => number;
    onChange: (newVal: ClientActivity) => void;
    onMiddleClick: () => void;
    loading: boolean;
}): JSX.Element => {
    const dragSize = 20;

    const [innerActivity, setInnerActivity] = useState(activity);
    useEffect(() => {
        setInnerActivity(activity);
    }, [activity]);

    const dayDiv = useRef<HTMLDivElement>(null);
    const dragImg = useRef<HTMLImageElement>(null);
    const [dragStartRect, setDragStartRect] = useState<DOMRect | null>(null);
    const getLocalCoords = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (!dayDiv.current) return { x: 0, y: 0, top: 0, bottom: 0, left: 0, right: 0 };
            const rect = dragStartRect || dayDiv.current.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                top: e.clientY - rect.top,
                bottom: rect.bottom - e.clientY,
                left: e.clientX - rect.left,
                right: rect.right - e.clientX,
            };
        },
        [dragStartRect, dayDiv]
    );
    const [dragStart, setDragStart] = useState(0);
    const [lastOffset, setLastOffset] = useState(0);
    const [dragging, setDragging] = useState<"" | "offset" | "top" | "bottom">("");
    const [cursor, setCursor] = useState("cursor-grab");

    useEffect(() => {
        if (!dayDiv.current) return;
        setDragStartRect(dayDiv.current.getBoundingClientRect());
    }, [dayDiv]);

    return (
        <div
            ref={dayDiv}
            className={`absolute grid place-items-center rounded-lg border border-neutral-800 ${
                loading ? "cursor-wait" : cursor
            } ${innerActivity.type.category.class}`}
            draggable
            style={{
                top: getY(innerActivity.start),
                height: getY(innerActivity.duration),
                width: "calc(100% - 0.5rem)",
                left: "0.25rem",
            }}
            onMouseLeave={() => setCursor("cursor-grab")}
            onMouseMove={e => {
                const coords = getLocalCoords(e);
                if (coords.top < dragSize || coords.bottom < dragSize) setCursor("cursor-n-resize");
                else setCursor("cursor-grab");
            }}
            onDragStart={e => {
                e.stopPropagation();
                if (dragImg.current) e.dataTransfer.setDragImage(dragImg.current, 0, 0);
                if (loading) return;
                const coords = getLocalCoords(e);
                if (coords.top < dragSize) setDragging("top");
                else if (coords.bottom < dragSize) setDragging("bottom");
                else setDragging("offset");
                const y = getLocalCoords(e).y;
                setDragStart(y);
            }}
            onDrag={e => {
                e.stopPropagation();
                if (!dragging) return;

                const coords = getLocalCoords(e);
                const offset = coords.y - dragStart;
                if (Math.abs(offset - lastOffset) > 50) return;
                setLastOffset(offset);
                let offsetHours = Math.round(getHour(offset) * 2) / 2;
                if (dragging === "top") {
                    if (activity.start + offsetHours < 0) offsetHours = -activity.start;
                    const newStart = activity.start + offsetHours;
                    const newDuration = activity.duration - offsetHours;
                    setInnerActivity({ ...activity, start: newStart, duration: newDuration });
                } else if (dragging === "bottom") {
                    if (activity.start + activity.duration + offsetHours > 24)
                        offsetHours = 24 - activity.start - activity.duration;
                    const newDuration = activity.duration + offsetHours;
                    setInnerActivity({ ...activity, duration: newDuration });
                } else if (dragging === "offset") {
                    if (activity.start + offsetHours < 0) offsetHours = -activity.start;
                    if (activity.start + activity.duration + offsetHours > 24)
                        offsetHours = 24 - activity.start - activity.duration;
                    const newStart = activity.start + offsetHours;
                    setInnerActivity({ ...activity, start: newStart });
                }
            }}
            onDragEnd={e => {
                e.stopPropagation();
                onChange(innerActivity);
                setDragging("");
                setDragStartRect(dayDiv.current?.getBoundingClientRect() || null);
                setLastOffset(0);
            }}
            onMouseDown={e => {
                if (loading) return;
                if (e.button === 1) onMiddleClick();
            }}
        >
            <div className="flex flex-col items-center">
                <span className="text-center leading-none">{activity.type.name}</span>
                {activity.note && activity.duration > 0.5 && (
                    <span className="text-xs text-center leading-none mt-1">{activity.note}</span>
                )}
            </div>
            <img className="absolute w-0 h-0" ref={dragImg} />
        </div>
    );
};

export default CalendarActivity;
