import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClientSiteData, DbSiteData } from "lib/types/SiteData";
import Calendar from "lib/Calendar";
import useAuth from "lib/auth/useAuth";
import { Database } from "lib/firebaseRtdbCrud";

export type DataContext = {
    loading: boolean;
    data: ClientSiteData | null;
    database: Calendar | null;
    revalidate: () => Promise<void>;
};

const defaultContextValue = {
    loading: false,
    data: null,
    database: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    revalidate: async () => {},
};

const dataContext = createContext<DataContext>(defaultContextValue);

const DataContextProvider = ({
    showInfo = false,
    showErrors = true,
    children,
}: {
    showInfo?: boolean;
    showErrors?: boolean;
    children: ReactNode;
}) => {
    const { user, loading: authLoading } = useAuth();
    const [value, setValue] = useState<DataContext>(defaultContextValue);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ClientSiteData | null>(null);
    const [calendar] = useState<Calendar>(new Calendar());

    const revalidate = useCallback(
        async (token?: string) => {
            if (loading) return;
            if (!calendar) return;

            setLoading(true);
            const rawData: DbSiteData = token
                ? await Database.get("/", token)
                : (await axios("/api/calendar")).data;
            calendar.setFromDb(rawData);

            setLoading(false);
        },
        [calendar, loading]
    );

    useEffect(() => {
        if (!calendar) return;
        if (showInfo) calendar.onInfo = toast.info;
        else calendar.onInfo = null;
    }, [calendar, showInfo]);

    useEffect(() => {
        if (!calendar) return;
        if (showErrors) calendar.onError = toast.error;
        else calendar.onError = null;
    }, [calendar, showErrors]);

    useEffect(() => {
        if (!calendar) return;
        if (authLoading) return;
        calendar.onDataUpdated = setData;
        revalidate(user?.token);
    }, [calendar, user, authLoading]);

    useEffect(() => {
        if (!calendar) return;

        setValue(cur => ({
            ...cur,
            loading,
            data,
            database: calendar,
        }));
    }, [data, calendar, loading]);

    return <dataContext.Provider value={{ ...value, revalidate }}>{children}</dataContext.Provider>;
};

const useData = () => {
    const context = useContext(dataContext);
    return context;
};

export { DataContextProvider };
export default useData;
