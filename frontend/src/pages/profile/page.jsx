import { useEffect } from "react"
import { Navigate, useNavigate } from 'react-router-dom'
import authServices from "../../services/auth.jsx"

export default function Profile() {
    const navigate = useNavigate()
    const { logout } = authServices()

    const authData = JSON.parse(localStorage.getItem('auth'))

    if (!authData) {
        return <Navigate to="/auth" replace></Navigate>
    }

    const handleLogout = () => {
        logout()

        navigate("/")
    }

    return (
        <>
            <h1>{authData?.user?.fullname}</h1>
            <h3>{authData?.user?.email}</h3>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}