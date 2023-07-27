import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import weeklogFormat from "lib/plugins/weeklogFormat";
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
    return (
        <>
            <div className="flex justify-center mb-4">
                <button className="text-2xl" onClick={() => offsetWeek(-1)}>
                    <FaArrowLeft />
                </button>
                <p className="text-2xl w-96 text-center">{week.weeklogWeek().prettyString}</p>
                <button className="text-2xl" onClick={() => offsetWeek(1)}>
                    <FaArrowRight />
                </button>
            </div>
            <div className="grid grid-cols-7 pl-8">
                {days.map(day => {
                    return (
                        <div key={day} className="grid place-items-center">
                            {<p>{dayjs(day, "YY-MM-DD").format("Do")}</p>}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default CalendarHeader;
