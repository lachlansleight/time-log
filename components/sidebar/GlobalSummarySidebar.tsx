import useData from "lib/hooks/useData";
import CalendarSummary from "components/calendar/CalendarSummary";


const GlobalSummarySidebar = ({
    isOpen
}: {
    isOpen: boolean,
}): JSX.Element => {

    const {data} = useData();

    if(!data) return <></>;
    return (
        <div
            className="relative ml-4 overflow-hidden"
            style={{
                transition: "all 0.2s",
                width: isOpen ? "18rem" : "0rem",
            }}
        >
            <div className="absolute left-0 top-0 w-72 px-4 py-10">
                <h1 className="text-3xl text-center mb-4">Overall Summary</h1>
                <CalendarSummary days={data.days.map(d => d.date)} data={data} />
            </div>
        </div>
    );
}

export default GlobalSummarySidebar;