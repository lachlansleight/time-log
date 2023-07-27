import { AppProps } from "next/dist/shared/lib/router/router";
import { ReactNode } from "react";
import "../styles/app.css";
import { DataContextProvider } from "lib/useData";

function MyApp({ Component, pageProps }: AppProps): ReactNode {
    return (
        <>
            <DataContextProvider>
                <Component {...pageProps} />
            </DataContextProvider>
        </>
    );
}

export default MyApp;
