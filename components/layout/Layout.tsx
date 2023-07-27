import { ReactNode } from "react";
import Head from "next/head";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    return (
        <>
            <Head>
                <title>TimeLog</title>
            </Head>
            <main className="min-h-screen bg-neutral-900 text-white">{children}</main>
        </>
    );
};

export default Layout;
