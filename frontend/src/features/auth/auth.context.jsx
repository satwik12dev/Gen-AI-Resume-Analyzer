import {createContext, useState, useEffect} from "react";
import {getMe} from "../auth/services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getandSetUser = async () => {
            const data = await getMe();
            setUser(data.user);
            setLoading(false);
        }
        getandSetUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}
