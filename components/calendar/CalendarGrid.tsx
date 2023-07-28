import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCallback, useMemo, useState } from "react";
import { useModal } from "@ebay/nice-modal-react";
import weeklogFormat from "lib/plugins/weeklogFormat";
import useData from "lib/hooks/useData";
import { ClientActivity } from "lib/types/Activity";
import ActivityModal from "components/modals/ActivityModal";
import CalendarHeader from "./CalendarHeader";
import CalendarRows from "./CalendarRows";
import CalendarDayColumn from "./CalendarDayColumn";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(weeklogFormat);

const CalendarGrid = ({
    week,
    onWeekChange,
    height = 1000,
}: {
    week: Dayjs;
    onWeekChange: (newVal: Dayjs) => void;
    height?: number;
}): JSX.Element => {
    const { data, database } = useData();
    // const [calendarData, setCalendarData] = useState<ClientSiteData | null>(null);
    // const [calendar] = useState<Calendar>(new Calendar());
    // useEffect(() => {
    //     if(!data?.rawData) return;
    //     if(!calendar) return;
    //     calendar.onDataUpdated = setCalendarData;
    //     calendar.onInfo = toast.info;
    //     calendar.onError = toast.error;
    //     calendar.setFromDb(data.rawData);
    // }, [data, calendar]);

    const activityModal = useModal(ActivityModal);
    const openActivityModal = useCallback(
        (d: string, activity?: ClientActivity) => {
            activityModal.show({
                activity,
                onChange: a => handleActivityChange(d, a),
                onDelete: a => handleActivityDelete(d, a),
            });
        },
        [activityModal]
    );

    //const [week, setWeek] = useState((defaultWeek ? dayjs(defaultWeek, "YY-MM-DD") : dayjs().startOf("isoWeek")).add(12, "hour"));
    const offsetWeek = useCallback(
        (offset: number) => {
            onWeekChange(week.add(Math.round(offset), "week"));
        },
        [week]
    );

    const days = useMemo(() => {
        const r: string[] = [];
        for (let i = 0; i < 7; i++) {
            r.push(week.add(i, "day").format("YY-MM-DD"));
        }
        return r;
    }, [week]);

    const getY = useCallback(
        (hour: number) => {
            return (hour * height) / 25;
        },
        [height]
    );

    const getHour = useCallback(
        (y: number) => {
            return (y * 25) / height;
        },
        [height]
    );

    const [loading, setLoading] = useState<string[]>([]);

    const handleActivityChange = (date: string, activity: ClientActivity) => {
        setLoading(cur => [...cur, activity.id]);
        database
            ?.updateActivity(date, activity)
            .then(() => setLoading(cur => cur.filter(d => d !== activity.id)));
    };

    const handleActivityDelete = (date: string, activity: ClientActivity) => {
        setLoading(cur => [...cur, activity.id, date]);
        database
            ?.deleteActivity(date, activity)
            .then(() => setLoading(cur => cur.filter(d => d !== activity.id && d !== date)));
    };

    const handleActivityCreate = (date: string, activity: ClientActivity) => {
        setLoading(cur => [...cur, date]);
        database
            ?.updateActivity(date, activity)
            .then(() => setLoading(cur => cur.filter(d => d !== date)));
        openActivityModal(date, activity);
    };

    return (
        <div
            className="flex flex-col h-full"
            onDragOver={e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            }}
        >
            <CalendarHeader week={week} days={days} offsetWeek={offsetWeek} />
            <div className="flex w-full relative" style={{ height }}>
                <CalendarRows />
                <div
                    className={`relative grid grid-cols-7 flex-grow border-l border-white border-opacity-10`}
                    style={{
                        top: "0.75rem",
                        height: `calc(100% - 2.5rem)`,
                    }}
                >
                    {days.map(date => (
                        <CalendarDayColumn
                            key={date}
                            date={date}
                            data={data?.days || []}
                            getY={getY}
                            getHour={getHour}
                            loading={loading}
                            handleActivityChange={a => handleActivityChange(date, a)}
                            handleActivityCreate={v => handleActivityCreate(date, v)}
                            handleActivityOpen={a => openActivityModal(date, a)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarGrid;
