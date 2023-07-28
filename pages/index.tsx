import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import CalendarGrid from "components/calendar/CalendarGrid";
import Layout from "components/layout/Layout";
import useDimensions from "lib/hooks/useDimensions";

const HomePage = (): JSX.Element => {
    const dimensions = useDimensions();
    const [week, setWeek] = useState<Dayjs>(dayjs().startOf("isoWeek").add(12, "hour"));

    return (
        <Layout>
            <div className="py-10">
                {dimensions.height > 0 && (
                    <CalendarGrid
                        week={week}
                        onWeekChange={setWeek}
                        height={dimensions.height - 152}
                    />
                )}
            </div>
        </Layout>
    );
};

export default HomePage;
