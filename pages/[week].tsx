import { useRouter } from "next/router";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import CalendarGrid from "components/calendar/CalendarGrid";
import Layout from "components/layout/Layout";
import useDimensions from "lib/hooks/useDimensions";

const HomePageWithWeek = (): JSX.Element => {
    const router = useRouter();
    const dimensions = useDimensions();

    const [week, setWeek] = useState<Dayjs | null>(null);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.week)
            setWeek(
                dayjs(router.query.week as string, "YY-MM-DD")
                    .startOf("isoWeek")
                    .add(12, "hour")
            );
        else setWeek(dayjs().startOf("isoWeek").add(12, "hour"));
    }, [router]);

    return (
        <Layout>
            <div className="py-10">
                {!!week && dimensions.height > 0 && (
                    <CalendarGrid
                        week={week}
                        onWeekChange={w => {
                            setWeek(w);
                            router.push(`/${w.format("YY-MM-DD")}`);
                        }}
                        height={dimensions.height - 152 - 24}
                    />
                )}
            </div>
        </Layout>
    );
};

export default HomePageWithWeek;
