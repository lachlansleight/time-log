import React, {
    useEffect,
    useState,
    useContext,
    createContext,
    ReactNode,
    useCallback,
} from "react";
import { useRouter } from "next/router";

import { FirebaseApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";

export interface FbUser {
    uid: string;
    email: string;
    token: string;
}

export interface AuthContextValues {
    user: FbUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<FbUser>;
    loginAndRedirect: (email: string, password: string, redirectTo: string) => Promise<void>;
    logout: () => Promise<void>;
    logoutAndRedirect: (redirectTo: string) => Promise<void>;
}

const mapUserData = async (user: User) => {
    const { uid, email } = user;
    const token = await user.getIdToken(true);
    const output: FbUser = {
        uid,
        email: email || "",
        token,
    };
    return output;
};

const authContext = createContext<AuthContextValues>({
    loading: false,
    user: null,
    login: () => {
        throw new Error("Auth not initialized");
    },
    loginAndRedirect: () => {
        throw new Error("Auth not initialized");
    },
    logout: () => {
        throw new Error("Auth not initialized");
    },
    logoutAndRedirect: () => {
        throw new Error("Auth not initialized");
    },
});

const AuthProvider = ({
    children,
    firebaseApp,
}: {
    children: ReactNode;
    firebaseApp: FirebaseApp;
}) => {
    const [user, setUser] = useState<FbUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    //Promise-style login method
    const login = useCallback(
        async (email: string, password: string) => {
            return new Promise<FbUser>((resolve, reject) => {
                try {
                    signInWithEmailAndPassword(getAuth(firebaseApp), email, password);
                } catch (error) {
                    reject(error);
                }
            });
        },
        [firebaseApp]
    );

    //Logs user in, then automatically redirects to the chosen page
    const loginAndRedirect = useCallback(
        async (email: string, password: string, redirectTo: string) => {
            try {
                await login(email, password);
                router.push(redirectTo);
            } catch (error) {
                console.error("Failed to login", error);
            }
        },
        [firebaseApp, router]
    );

    //Promise-style logout method
    const logout = useCallback(async () => {
        return new Promise<void>((resolve, reject) => {
            try {
                signOut(getAuth(firebaseApp)).then(resolve);
            } catch (error) {
                reject(error);
            }
        });
    }, [firebaseApp]);

    //Logs user out, then automatically redirects to the chosen page
    const logoutAndRedirect = useCallback(
        async (redirectTo: string) => {
            signOut(getAuth(firebaseApp))
                .then(() => {
                    // Sign-out successful.
                    if (redirectTo) router.push(redirectTo);
                })
                .catch(e => {
                    console.error("Logout failed", e);
                });
        },
        [firebaseApp, router]
    );
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    useEffect(() => {
        const cancelAuthListener = onAuthStateChanged(getAuth(firebaseApp), async user => {
            if (user) {
                const userData = await mapUserData(user);
                setUser(userData);
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            cancelAuthListener();
        };
    }, []);

    return (
        <authContext.Provider
            value={{
                user,
                loading,
                login,
                loginAndRedirect,
                logout,
                logoutAndRedirect,
            }}
        >
            {children}
        </authContext.Provider>
    );
};

interface UseAuthProps {
    redirectTo?: string;
    redirectToIfNotAdmin?: string;
}

const useAuth = (props?: Partial<UseAuthProps>) => {
    /* eslint-disable @typescript-eslint/no-unused-vars*/
    const { user, loading, login, loginAndRedirect, logout, logoutAndRedirect } =
        useContext(authContext);
    /* eslint-enable @typescript-eslint/no-unused-vars*/
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (redirecting) return;

        //user is null when explicitly unset i.e. signed out or no token
        if (user === null && props?.redirectTo) {
            setRedirecting(true);
        } else if (user && props?.redirectToIfNotAdmin) {
            setRedirecting(true);
        }
    }, [props, user, redirecting]);

    return useContext(authContext);
};

export { AuthProvider };
export default useAuth;

//https://github.com/vercel/next.js/blob/canary/examples/with-firebase-authentication/components/FirebaseAuth.js
