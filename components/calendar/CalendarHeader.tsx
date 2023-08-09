import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import weeklogFormat from "lib/plugins/weeklogFormat";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(weeklogFormat);

const CalendarHeader = ({
    week,
    offsetWeek,
}: {
    week: dayjs.Dayjs;
    offsetWeek: (offset: number) => void;
}): JSX.Element => {
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
        </>
    );
};

export default CalendarHeader;
