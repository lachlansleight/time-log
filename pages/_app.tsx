import { AppProps } from "next/dist/shared/lib/router/router";
import { ReactNode } from "react";
import { Slide, ToastContainer } from "react-toastify";
import "../styles/app.css";
import NiceModal from "@ebay/nice-modal-react";
import { DataContextProvider } from "lib/hooks/useData";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "lib/auth/useAuth";
import initFirebase from "lib/auth/initFirebase";
import { SidebarContextProvider } from "lib/hooks/useSidebar";

function TimelogApp({ Component, pageProps }: AppProps): ReactNode {
    const firebaseApp = initFirebase();

    return (
        <>
            <AuthProvider firebaseApp={firebaseApp}>
                <SidebarContextProvider>
                    <DataContextProvider showInfo={false} showErrors={true}>
                        <NiceModal.Provider>
                            <Component {...pageProps} />
                            <ToastContainer
                                position={"bottom-center"}
                                theme={"dark"}
                                transition={Slide}
                                hideProgressBar={true}
                                limit={3}
                                autoClose={3000}
                            />
                        </NiceModal.Provider>
                    </DataContextProvider>
                </SidebarContextProvider>
            </AuthProvider>
        </>
    );
}

export default TimelogApp;
