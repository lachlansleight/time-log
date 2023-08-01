import React, { useCallback, useEffect, useState } from "react";
import { FbUser } from "lib/auth/useAuth";
import TextField from "components/controls/TextField";

const LoginForm = ({
    user,
    onSubmit,
    loginError,
}: {
    user?: FbUser;
    onSubmit: (email: string, password: string) => void;
    loginError?: string;
}): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        if (loginError) setError(loginError);
    }, [loginError]);

    const tryLogin = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!email || !password) {
                setError("Please enter an email and password");
                return;
            }
            //validate email with regex
            if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
                setError("Please enter a valid email");
                return;
            }
            onSubmit(email, password);
        },
        [email, password]
    );

    return (
        <div>
            <h1 className="text-4xl mb-4">Login</h1>
            {user ? (
                <div>
                    <p>You are already logged in!</p>
                </div>
            ) : (
                <form className="flex flex-col gap-2" onSubmit={tryLogin}>
                    <TextField label="Email" value={email} onChange={setEmail} />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                    />
                    <input
                        type="submit"
                        className="bg-primary-800 rounded py-1 grid place-items-center text-lg"
                        onClick={tryLogin}
                        value={"Login"}
                    />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                </form>
            )}
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
};

export default LoginForm;
