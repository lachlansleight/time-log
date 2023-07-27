import Calendar from "components/calendar/Calendar";
import Layout from "components/layout/Layout";
import useDimensions from "lib/useDimensions";

const HomePage = (): JSX.Element => {
    const dimensions = useDimensions();

    return (
        <Layout>
            <div className="py-10">
                {dimensions.height > 0 && <Calendar height={dimensions.height - 152} />}
            </div>
        </Layout>
    );
};

export default HomePage;
