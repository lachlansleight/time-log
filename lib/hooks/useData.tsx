import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import SiteData, { ClientSiteData, DbSiteData } from "lib/types/SiteData";

export type DataContext = {
    loading: boolean;
    data: ClientSiteData | null;
    revalidate: () => Promise<void>;
};

const defaultContextValue = {
    loading: false,
    data: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    revalidate: async () => {},
};

const dataContext = createContext<DataContext>(defaultContextValue);

const DataContextProvider = ({ children }: { children: ReactNode }) => {
    const [value, setValue] = useState<DataContext>(defaultContextValue);
    const revalidate = useCallback(async () => {
        if (value.loading) return;

        setValue(cur => ({
            ...cur,
            loading: true,
        }));
        console.log("Loading data");
        const allData: DbSiteData = (
            await axios(process.env.NEXT_PUBLIC_FIREBASE_DATABASE + "/.json")
        ).data;
        setValue(cur => ({
            ...cur,
            loading: false,
            data: SiteData.dbToClient(allData),
        }));
    }, [value.loading]);

    useEffect(() => {
        revalidate();
    }, []);

    return <dataContext.Provider value={{ ...value, revalidate }}>{children}</dataContext.Provider>;
};

const useData = () => {
    const context = useContext(dataContext);
    return context;
};

export { DataContextProvider };
export default useData;
