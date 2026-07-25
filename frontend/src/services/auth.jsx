import { useState } from "react";

export default function authServices () {
    const [ authLoading, setAuthLoading ] = useState(false)

    const url = 'http://localhost:3000/auth'

    const login = (formData) => {
        setAuthLoading(true)
        console.log(JSON.stringify(formData));

        fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        })
        .then(async (response) => {
            console.log("Status:", response.status);

            const data = await response.json();

            console.log("Resposta:", data);

            return data;
        })
        .then((result) => {
            console.log(result)
            if (result.success && result.body.token) {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({token: result.body.token,
                        user: result.body.user
                    }))
            }
        })
        .catch ((error) => {
            console.log(error);
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    const logout = () => {
        
    }

    const signup = (formData) => {
        setAuthLoading(true)

        fetch(`${url}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        })
        .then((respone) => respone.json())
        .then((result) => {
            console.log(result)

            if (result.success && result.body.token) {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({token: result.body.token,
                        user: result.body.user
                    }))
            }
        })
        .catch ((error) => {
            console.log(error);
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    return { signup, login, logout, authLoading }
}