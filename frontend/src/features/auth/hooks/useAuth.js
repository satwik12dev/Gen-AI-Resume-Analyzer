import {useContext, useEffect} from "react";
import { AuthContext } from "../auth.context.jsx";
import {login, register,logout,getMe} from "../services/auth.api.js";


export const useAuth = () => {
    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;

    /**
     * @description This function is used to handle the login of the user. It takes the email and password as parameters and calls the login function from the auth.service.js file. It then sets the user and loading state accordingly.
     */
    const handlelogin = async (email, password) => {
        setLoading(true);
        try{
            const response = await login({ email, password });
        setUser(response.user);
        }catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * @description This function is used to handle the registration of the user. It takes the username, email, and password as parameters and calls the register function from the auth.service.js file. It then sets the user and loading state accordingly.
     */
    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try{
            const response = await register({ username, email, password });
            setUser(response.user);
        }catch (error) {
            console.log(error);
        } finally {
        setLoading(false);
        }
    }

    /**
     * @description This function is used to handle the logout of the user. It calls the logout function from the auth.service.js file, clears the user state, and sets the loading state to false.
     */
    const handleLogout = async () => {
        setLoading(true);
        try{
            const data = await logout();
            setUser(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        const getandSetUser = async () => {
            const data = await getMe();
            setUser(data.user);
            setLoading(false);
        }
        getandSetUser();
    }, []);
    
    return {
        user,
        loading,
        handlelogin,
        handleRegister,
        handleLogout
    }
}