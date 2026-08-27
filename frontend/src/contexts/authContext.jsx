import { createContext, useState, useEffect, useContext } from "react";
import authServices from "../services/auth";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const isAdmin = user?.role === 'admin'
    const { login, logout, signup, getUser } = authServices()

    useEffect(() => {
        const authenticate = async () => {
            const authData = JSON.parse(localStorage.getItem('auth'))

            if (!authData?.token) {
                setLoading(false)
                return
            }

            const loggedUser = await getUser(authData.token)

            if (loggedUser) {
                setUser(loggedUser)
            }

            setLoading(false)
        }

        authenticate()
    }, [])


    const contextLogout = () => {
        logout()
        setUser(null)
    }

    const contextLogin = async (formData) => {
        const result = await login(formData)

        if (result) {
            setUser(result.user)
            if (result.user.role === 'admin') {
                setIsAdmin(true)
            }
        }

        return result
    }

    const contextSignup = async (formData) => {
        const result = await signup(formData)

        if (result) {
            setUser(result.user)
        }

        return result
    }

    return (
        <AuthContext.Provider value={{isAuthenticated: !!user, user, loading, isAdmin, login: contextLogin, signup: contextSignup, logout: contextLogout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)