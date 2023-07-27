import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useModal } from "@ebay/nice-modal-react";
import weeklogFormat from "lib/plugins/weeklogFormat";
import useData from "lib/hooks/useData";
import { ClientSiteData } from "lib/types/SiteData";
import Day from "lib/types/Day";
import { ClientActivity } from "lib/types/Activity";
import ActivityType from "lib/types/ActivityType";
import Category from "lib/types/Category";
import ActivityModal from "components/modals/ActivityModal";
import CalendarHeader from "./CalendarHeader";
import CalendarRows from "./CalendarRows";
import CalendarDayColumn from "./CalendarDayColumn";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(weeklogFormat);

const Calendar = ({ height = 1000 }: { height?: number }): JSX.Element => {
    const data = useData();

    const activityModal = useModal(ActivityModal);
    const openActivityModal = useCallback(
        (activity?: ClientActivity) => {
            activityModal.show({ activity, onChange: handleActivityChange });
        },
        [activityModal]
    );

    const [week, setWeek] = useState(dayjs().startOf("isoWeek").add(12, "hour"));
    const offsetWeek = useCallback(
        (offset: number) => {
            setWeek(cur => cur.add(Math.round(offset), "week"));
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

    const [localData, setLocalData] = useState<ClientSiteData>({
        days: [],
        activityTypes: [],
        categories: [],
    });
    useEffect(() => {
        if (!data.data) return;
        setLocalData(data.data);
    }, [data]);

    const [loading, setLoading] = useState<string[]>([]);
    const [loadingActive, setLoadingActive] = useState<string[]>([]);

    useEffect(() => {
        const doLoad = async (id: string) => {
            if (loadingActive.includes(id)) return;

            console.log("Updating " + id);
            setLoadingActive(c => [...c, id]);

            const requests: Promise<any>[] = [];

            const day = localData.days.find(d => !!d.activities.find(a => a.id === id));
            const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE || "";
            if (day) {
                const activity = day.activities.find(a => a.id === id);
                console.log(activity);
                if (activity) {
                    const dbData = Day.clientToDb(day);
                    console.log(dbData);
                    requests.push(axios.put(`${dbUrl}/days/${day.date}.json`, dbData));

                    const existingActivityType = localData.activityTypes.find(at => at.id === activity.type.id);
                    if (!existingActivityType) {
                        const existingCategory = localData.categories.find(c => c.id === activity.type.category.id);
                        if (!existingCategory) {
                            requests.push(
                                axios.put(
                                    `${dbUrl}/categories/${activity.type.category.id}.json`,
                                    Category.clientToDb(activity.type.category)
                                )
                            );
                        } else if(JSON.stringify(existingCategory) !== JSON.stringify(activity.type.category)) {
                            requests.push(
                                axios.put(
                                    `${dbUrl}/categories/${activity.type.category.id}.json`,
                                    Category.clientToDb(activity.type.category)
                                )
                            );
                        }

                        requests.push(
                            axios.put(
                                `${dbUrl}/activityTypes/${activity.type.id}.json`,
                                ActivityType.clientToDb(activity.type)
                            )
                        );
                    } else if(JSON.stringify(existingActivityType) !== JSON.stringify(activity.type)) {
                        requests.push(
                            axios.put(
                                `${dbUrl}/activityTypes/${activity.type.id}.json`,
                                ActivityType.clientToDb(activity.type)
                            )
                        );
                    }
                }
            }

            await Promise.all(requests);

            setLoadingActive(c => c.filter(i => i !== id));
            setLoading(c => c.filter(i => i !== id));
        };

        loading.forEach(id => doLoad(id));
    }, [loading, loadingActive]);

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

    const handleActivityChange = (activity: ClientActivity) => {
        setLocalData(cur => {
            const day = cur.days.find(d => !!d.activities.find(a => a.id === activity.id));
            if (!day) return cur;
            const index = day.activities.findIndex(a => a.id === activity.id);
            if (index === -1) return cur;
            setLoading(c => {
                if (!c.includes(activity.id)) return [...c, activity.id];
                return c;
            });
            return {
                ...cur,
                days: cur.days.map(d => {
                    if (d.date !== day.date) return d;
                    return {
                        ...d,
                        activities: d.activities.map((a, i) => {
                            if (i !== index) return a;
                            return activity;
                        }),
                    };
                }),
            };
        });
    };

    const handleActivityCreate = (date: string, activity: ClientActivity) => {
        setLocalData(cur => {
            const day = cur.days.find(d => d.date === date);
            if (!day) {
                const newDay = {
                    date,
                    activities: [activity],
                };
                setLoading(c => [...c, activity.id]);
                return { ...cur, days: [...cur.days, newDay] };
            } else {
                //do nothing if we clicked within an existing event
                const newEnd = activity.start + activity.duration;
                const existingActivity = day.activities.find(a => {
                    const end = a.start + a.duration;
                    if (activity.start > a.start && activity.start < end) return true;
                    if (newEnd > a.start && newEnd < end) return true;
                    return false;
                });
                if (existingActivity) return cur;
                setLoading(c => [...c, activity.id]);
                return {
                    ...cur,
                    days: cur.days.map(d => {
                        if (d.date !== date) return d;
                        return { ...d, activities: [...d.activities, activity] };
                    }),
                };
            }
        });
    };

    return (
        <div className="flex flex-col h-full">
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
                    {days.map(day => (
                        <CalendarDayColumn
                            key={day}
                            day={day}
                            data={localData.days}
                            getY={getY}
                            getHour={getHour}
                            loading={loading}
                            handleActivityChange={handleActivityChange}
                            handleActivityCreate={v => handleActivityCreate(day, v)}
                            handleActivityOpen={openActivityModal}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
