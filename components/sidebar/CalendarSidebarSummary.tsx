import { ClientSiteData } from "lib/types/SiteData";
import CalendarSummary from "components/calendar/CalendarSummary";

const CalendarSidebarSummary = ({
    isOpen,
    days,
    data,
}: {
    isOpen: boolean;
    days: string[];
    data: ClientSiteData;
}): JSX.Element => {
    return (
        <div
            className="relative ml-4 overflow-hidden"
            style={{
                transition: "all 0.2s",
                width: isOpen ? "18rem" : "0rem",
            }}
        >
            <div className="absolute left-0 top-0 w-72 px-4">
                <h1 className="text-3xl text-center mb-4">Week Summary</h1>
                <CalendarSummary days={days} data={data} />
            </div>
        </div>
    );
};

export default CalendarSidebarSummary;
