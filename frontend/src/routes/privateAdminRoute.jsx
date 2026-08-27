import { Navigate, Outlet } from "react-router-dom";
import  { useAuth } from "../contexts/authContext";
import Loading from "../pages/loading/page.jsx"

const PrivateAdminRoute = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth()

    if (loading) {
        return <Loading></Loading>
    }

    return isAuthenticated && isAdmin? <Outlet/> : <Navigate to="/" replace/>
}

export default PrivateAdminRoute;