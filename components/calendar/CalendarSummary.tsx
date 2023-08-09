import { useEffect, useState } from "react";
import { FaHourglassHalf, FaListUl, FaMinus, FaPlus } from "react-icons/fa";
import { ClientSiteData } from "lib/types/SiteData";
import { ClientCategory } from "lib/types/Category";
import { ClientActivityType } from "lib/types/ActivityType";

const CalendarSummary = ({
    days,
    data,
}: {
    days: string[];
    data: ClientSiteData;
}): JSX.Element => {

    const [categoryCounts, setCategoryCounts] = useState<
        { category: ClientCategory; activities: number; hours: number }[]
    >([]);
    const [activityCounts, setActivityCounts] = useState<
        { type: ClientActivityType; activities: number; hours: number }[]
    >([]);
    const [expandedCategory, setExpandedCategory] = useState("");

    useEffect(() => {
        const categories: Record<
            string,
            { category: ClientCategory; activities: number; hours: number }
        > = {};
        const activities: Record<
            string,
            { type: ClientActivityType; activities: number; hours: number }
        > = {};

        data.days
            .filter(d => days.includes(d.date))
            .forEach(d => {
                d.activities.forEach(a => {
                    if (!activities[a.type.id])
                        activities[a.type.id] = { type: a.type, activities: 0, hours: 0 };
                    activities[a.type.id].activities++;
                    activities[a.type.id].hours += a.duration;

                    if (!categories[a.type.category.id])
                        categories[a.type.category.id] = {
                            category: a.type.category,
                            activities: 0,
                            hours: 0,
                        };
                    categories[a.type.category.id].activities++;
                    categories[a.type.category.id].hours += a.duration;
                });
            });

        setCategoryCounts(Object.values(categories).sort((a, b) => b.hours - a.hours));
        setActivityCounts(Object.values(activities).sort((a, b) => b.hours - a.hours));
    }, [days, data]);

    return (
        <div>
            {categoryCounts.length > 0 ? (
            <>
                <div className="flex flex-col gap-4">
                    <span className="text-xl font-bold text-center -mb-2">
                        Categories
                    </span>
                    {categoryCounts.map(c => (
                        <div
                            key={c.category.id}
                            className="flex flex-col gap-1 pb-1 border border-white border-opacity-10 rounded"
                        >
                            <span
                                className={`font-bold rounded-tr rounded-tl px-2 ${c.category.previewClass}`}
                            >
                                {c.category.name}
                            </span>
                            <div className="flex gap-4">
                                <span className="w-16 ml-2 flex justify-center gap-1 items-center">
                                    <FaHourglassHalf />
                                    {c.hours}
                                </span>
                                <span className="w-16 ml-2 flex justify-center gap-1 items-center">
                                    <FaListUl />
                                    {c.activities}
                                </span>
                                <span
                                    className="w-12 ml-4 bg-neutral-700 rounded grid place-items-center cursor-pointer"
                                    onClick={() =>
                                        setExpandedCategory(cur =>
                                            cur === c.category.id ? "" : c.category.id
                                        )
                                    }
                                >
                                    {expandedCategory === c.category.id ? (
                                        <FaMinus />
                                    ) : (
                                        <FaPlus />
                                    )}
                                </span>
                            </div>
                            {expandedCategory === c.category.id && (
                                <div className="flex flex-col gap ml-6 text-xs">
                                    {activityCounts
                                        .filter(ac => ac.type.category.id === c.category.id)
                                        .map(a => (
                                            <div key={a.type.id} className="flex gap-4">
                                                <span className="flex items-center gap-1 w-12">
                                                    <FaHourglassHalf />
                                                    {a.hours}
                                                </span>
                                                <span>{a.type.name}</span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4 mt-8">
                    <span className="text-xl font-bold text-center -mb-2">
                        Top 5 Activities
                    </span>
                    {activityCounts
                        .filter(ac => ac.type.id !== "uncategorized")
                        .slice(0, 5)
                        .map(a => (
                            <div
                                key={a.type.id}
                                className="flex flex-col gap-1 pb-1 border border-white border-opacity-10 rounded"
                            >
                                <span
                                    className={`font-bold rounded-tr rounded-tl px-2 ${a.type.category.previewClass}`}
                                >
                                    {a.type.name}
                                </span>
                                <div className="flex justify-between gap-4">
                                    <span className="w-16 ml-2 flex gap-1 items-center">
                                        <FaHourglassHalf />
                                        {a.hours}
                                    </span>
                                    <span className="w-16 ml-2 flex gap-1 items-center">
                                        <FaListUl />
                                        {a.activities}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </>
        ) : (
            <div className="grid place-items-center">
                <span className="text-2xl text-center">No time logged for this week</span>
            </div>
        )}
        </div>
    )
}

export default CalendarSummary;