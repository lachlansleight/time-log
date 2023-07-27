import { AppProps } from "next/dist/shared/lib/router/router";
import { ReactNode } from "react";
import "../styles/app.css";
import NiceModal from "@ebay/nice-modal-react";
import { DataContextProvider } from "lib/hooks/useData";

function MyApp({ Component, pageProps }: AppProps): ReactNode {
    return (
        <>
            <DataContextProvider>
                <NiceModal.Provider>
                    <Component {...pageProps} />
                </NiceModal.Provider>
            </DataContextProvider>
        </>
    );
}

export default MyApp;
