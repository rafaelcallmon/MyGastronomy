import { useEffect, useState } from "react"
import { TextField, Button } from "@mui/material"
import styles from "./page.module.css"
import authServices from "../../services/auth.jsx"
import { Navigate } from 'react-router-dom'
import { LuLogIn } from "react-icons/lu";
import { useAuth } from "../../contexts/authContext.jsx"
import Loading from "../loading/page.jsx"

export default function Auth() {
    const [formType, setFormType] = useState('login')
    const [formData, setFormData] = useState(null)
    const { login, signup, loading} = useAuth()
    const authData = JSON.parse(localStorage.getItem('auth'))

    if (authData) {
        return <Navigate to="/profile" replace></Navigate>
    }

    const handleChangeFormType = () => {
        setFormData(null)

        if (formType === 'login') {
            setFormType('signup')
        } else {
            setFormType('login')
        }
    }

    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        console.log(formData)
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()

        switch (formType) {
            case 'login':
                login(formData)

                break
            case 'signup':
                if (formData.password !== formData.confirmPassword) {
                    console.log("Passwords do not match");
                    return
                }
                signup(formData)

                break
        }
    }

    if (loading) {
        return (
            <Loading></Loading>
        )
    }

    return (
        <div className={styles.authPageContainer}>
                {formType === 'login' ? (
                    <>
                        <h1>Login</h1>
                        <button onClick={handleChangeFormType}>Don't you have an account? Click here</button>
                        <form onSubmit={handleSubmitForm}>
                            <TextField
                            required
                            label='Email'
                            type="email"
                            name="email"
                            onChange={handleFormDataChange}
                            />

                            <TextField
                            required
                            label='Password'
                            type="password"
                            name="password"
                            onChange={handleFormDataChange}
                            />

                            <button type="submit">Login <LuLogIn /></button>
                        </form>
                    </>
                ) : null}

                {formType === 'signup' ? (
                    <>
                        <h1>Signup</h1>
                        <button onClick={handleChangeFormType}>Already have an account? Click here</button>

                        <form onSubmit={handleSubmitForm}>
                            <TextField
                            required
                            label='Fullname'
                            type="fullname"
                            name="fullname"
                            onChange={handleFormDataChange}
                            />

                            <TextField
                            required
                            label='Email'
                            type="email"
                            name="email"
                            onChange={handleFormDataChange}
                            />

                            <TextField
                            required
                            label='Password'
                            type="password"
                            name="password"
                            onChange={handleFormDataChange}
                            />

                            <TextField
                            required
                            label='Confirm password'
                            type="password"
                            name="confirmPassword"
                            onChange={handleFormDataChange}
                            />

                            <button type="submit">Signup <LuLogIn /></button>
                        </form>
                    </>
                ): null}
        </div>
    )
}