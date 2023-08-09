import { FaBoxes, FaListUl } from "react-icons/fa";
import useSidebar from "lib/hooks/useSidebar";
import GlobalSummarySidebar from "./GlobalSummarySidebar";

const SidebarIcon = ({
    targetPage,
    children
}: {
    targetPage: string,
    children: React.ReactNode,
}): JSX.Element => {

    const {page, setPage} = useSidebar();
    const isActive = page === targetPage;

    return (
        <div 
            className={`h-10 cursor-pointer grid place-items-center text-xl border-b border-white border-opacity-10 ${isActive ? "bg-neutral-900" : ""}`}
            onClick={() => {
                setPage(page === targetPage ? "" : targetPage)
            }}
        >
            {children}
        </div>
    )
}

const Sidebar = (): JSX.Element => {
    const {page} = useSidebar();

    return (
        <div className="flex" style={{
            height: "calc(100vh - 2rem)"
        }}>
            <div className="w-10 bg-neutral-800 py-10 h-full">
                <div className="flex flex-col border-white border-t border-opacity-10">
                    <SidebarIcon targetPage="week-summary">
                        <FaListUl />
                    </SidebarIcon>
                    <SidebarIcon targetPage="global-summary">
                        <FaBoxes />
                    </SidebarIcon>
                </div>
            </div>
            <GlobalSummarySidebar isOpen={page === "global-summary"} />
        </div>
    )
}

export default Sidebar;