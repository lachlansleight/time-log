import axios from "axios";

/** Simple wrapper for the CRUD operations in the Firebase RTDB REST API */
export const Database = {
    /** Performs a GET request - note that the path requires a leading slash, and no ".json" */
    get: async (path: string, auth?: string): Promise<any> => {
        const result = await axios(
            process.env.NEXT_PUBLIC_FIREBASE_DATABASE +
                path +
                ".json" +
                (auth ? "?auth=" + auth : "")
        );
        return result.data;
    },

    /** Performs a PUT request - note that the path requires a leading slash, and no ".json" */
    put: async (auth: string, path: string, data: any): Promise<any> => {
        const result = await axios.put(
            process.env.NEXT_PUBLIC_FIREBASE_DATABASE + path + ".json?auth=" + auth,
            data
        );
        return result.data;
    },

    /** Performs a POST request - note that the path requires a leading slash, and no ".json" */
    post: async (auth: string, path: string, data: any): Promise<any> => {
        const result = await axios.post(
            process.env.NEXT_PUBLIC_FIREBASE_DATABASE + path + ".json?auth=" + auth,
            data
        );
        return result.data;
    },

    /** Performs a PATCH request - note that the path requires a leading slash, and no ".json" */
    patch: async (auth: string, path: string, data: any): Promise<any> => {
        const result = await axios.patch(
            process.env.NEXT_PUBLIC_FIREBASE_DATABASE + path + ".json?auth=" + auth,
            data
        );
        return result.data;
    },

    /** Performs a DELETE request - note that the path requires a leading slash, and no ".json" */
    delete: async (auth: string, path: string): Promise<any> => {
        const result = await axios.delete(
            process.env.NEXT_PUBLIC_FIREBASE_DATABASE + path + ".json?auth=" + auth
        );
        return result.data;
    },

    /** Returns a firebase ID token for write operations - only works on the server */
    getIdToken: async (email?: string, password?: string): Promise<string> => {
        try {
            const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
            const idToken = (
                await axios.post(
                    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
                    {
                        email: email || process.env.FB_EMAIL,
                        password: password || process.env.FB_PASSWORD,
                        returnSecureToken: true,
                    }
                )
            ).data.idToken;
            return idToken;
        } catch (e: any) {
            console.error("Failed to get ID token: " + e.message);
            return "";
        }
    },
};
