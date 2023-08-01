import { ReactNode, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useModal } from "@ebay/nice-modal-react";
import useAuth from "lib/auth/useAuth";
import LoginModal from "components/modals/LoginModal";
import packageJson from "../../package.json";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    const { loading, user, logout, login } = useAuth();

    const router = useRouter();

    const loginModal = useModal(LoginModal);
    const openLoginModal = useCallback(() => {
        if (!login) return;
        loginModal.show({
            user: user || undefined,
            onSubmit: (e, p) => login(e, p).then(() => router.reload()),
        });
    }, [loginModal, login]);

    useEffect(() => {
        if (!loginModal.visible) return;
        if (user) loginModal.remove();
    }, [user, loginModal]);

    const doLogout = useCallback(async () => {
        if (!logout) return;
        if (!router) return;
        try {
            await logout();
            router.reload();
        } catch (e: any) {
            console.error(e);
        }
    }, [logout, router]);

    return (
        <>
            <Head>
                <title>TimeLog</title>
            </Head>
            <main className="min-h-screen bg-neutral-900 text-white">
                <div className="h-8 bg-neutral-800 flex justify-between items-center shadow-md px-8">
                    <div />
                    <div className="flex items-center text-xl italic">
                        Time Log{" "}
                        <span className="text-xs relative top-1 left-2 text-white text-opacity-50">
                            v{packageJson.version}
                        </span>
                    </div>
                    {loading ? (
                        <div />
                    ) : user ? (
                        <div className="cursor-pointer" onClick={doLogout}>
                            Logout
                        </div>
                    ) : (
                        <div className="cursor-pointer" onClick={openLoginModal}>
                            Login
                        </div>
                    )}
                </div>
                {children}
            </main>
        </>
    );
};

export default Layout;
