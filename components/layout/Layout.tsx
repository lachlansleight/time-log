import { ReactNode } from "react";
import Head from "next/head";
import packageJson from "../../package.json";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    return (
        <>
            <Head>
                <title>TimeLog</title>
            </Head>
            <main className="min-h-screen bg-neutral-900 text-white">
                <div className="h-8 bg-neutral-800 flex justify-center items-center text-xl italic shadow-md">
                    Time Log{" "}
                    <span className="text-xs relative top-1 left-2 text-white text-opacity-50">
                        v{packageJson.version}
                    </span>
                </div>
                {children}
            </main>
        </>
    );
};

export default Layout;
