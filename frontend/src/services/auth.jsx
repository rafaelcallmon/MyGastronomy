import { useState } from "react";

export default function authServices () {
    const [ authLoading, setAuthLoading ] = useState(false)

    const url = 'http://localhost:3000/auth'

    const getUser = async (token) => {
        try {
            const response = await fetch(`${url}/authenticate`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            const result = await response.json()

            if (result.success) {
                return result.body
            }

            return null
        } catch (error) {
            console.log(error)
            return null
        }
}

    const login = async (formData) => {
        setAuthLoading(true)

        try {
            const response = await fetch(`${url}/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (result.success && result.body.token) {
                const authData = {
                    token: result.body.token,
                    user: result.body.user
                }

                localStorage.setItem('auth', JSON.stringify(authData))

                return authData
            }

            return null
        } catch (error) {
            console.log(error);
            return null
        } finally {
            setAuthLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('auth')
    }

    const signup = async (formData) => {
        setAuthLoading(true)

        try {
            const respone = await fetch(`${url}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const result = await respone.json()

            if (result.success && result.body.token) {
                const authData = {
                        token: result.body.token,
                        user: result.body.user
                    }

                localStorage.setItem('auth', JSON.stringify(authData))

                return authData
            }

            return null
        } catch (error) {
            console.log(error);
            return null
        } finally {
            setAuthLoading(false)
        }
    }

    return { signup, login, logout, getUser, authLoading }
}