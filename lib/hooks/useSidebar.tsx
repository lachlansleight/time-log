import { useState, useContext, createContext, ReactNode } from "react";


const sidebarCtx = createContext({
    page: "",
    setPage: (newPage: string) => console.error("not implemented", newPage),
});

const SidebarContextProvider = ({children}: {children: ReactNode}) => {
    const [page, setPage] = useState("");
    return <sidebarCtx.Provider value={{page, setPage}}>{children}</sidebarCtx.Provider>
}

const useSidebar = () => {
    const ctx = useContext(sidebarCtx);
    return ctx;
}

export {SidebarContextProvider};
export default useSidebar;