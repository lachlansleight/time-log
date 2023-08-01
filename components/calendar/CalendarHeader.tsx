import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import weeklogFormat from "lib/plugins/weeklogFormat";
import useAuth from "lib/auth/useAuth";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(weeklogFormat);

const CalendarHeader = ({
    week,
    offsetWeek,
    days,
}: {
    week: dayjs.Dayjs;
    offsetWeek: (offset: number) => void;
    days: string[];
}): JSX.Element => {
    const { user } = useAuth();

    return (
        <>
            <div className="flex justify-center mb-4">
                <button className="text-2xl" onClick={() => offsetWeek(-1)}>
                    <FaAngleDoubleLeft />
                </button>
                <p className="text-2xl w-96 text-center">{week.weeklogWeek().prettyString}</p>
                <button className="text-2xl" onClick={() => offsetWeek(1)}>
                    <FaAngleDoubleRight />
                </button>
            </div>
            <div className="grid grid-cols-7 pl-8">
                {days.map(day => {
                    if (user) {
                        return (
                            <Link
                                key={day}
                                href={`https://www.rescuetime.com/browse/activities/by/hour/for/the/day/of/20${day}`}
                                passHref
                            >
                                <a
                                    className="grid place-items-center cursor-pointer"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="text-center leading-none">
                                        {dayjs(day, "YY-MM-DD").format("dddd")}{" "}
                                        {dayjs(day, "YY-MM-DD").format("Do")}
                                        <FaExternalLinkAlt className="inline relative -top-0.5 ml-2 text-white text-opacity-40" />
                                    </span>
                                </a>
                            </Link>
                        );
                    } else {
                        return (
                            <div key={day} className="grid place-items-center">
                                <span className="text-center leading-none">
                                    {dayjs(day, "YY-MM-DD").format("dddd")}{" "}
                                    {dayjs(day, "YY-MM-DD").format("Do")}
                                </span>
                            </div>
                        );
                    }
                })}
            </div>
        </>
    );
};

export default CalendarHeader;
