import { AppProps } from "next/dist/shared/lib/router/router";
import { ReactNode } from "react";
import { Slide, ToastContainer } from "react-toastify";
import "../styles/app.css";
import NiceModal from "@ebay/nice-modal-react";
import { DataContextProvider } from "lib/hooks/useData";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps): ReactNode {
    return (
        <>
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
        </>
    );
}

export default MyApp;
