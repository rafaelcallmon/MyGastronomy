import { Navigate, Outlet } from "react-router-dom";
import  { AuthProvider, useAuth } from "../contexts/authContext";
import Loading from "../pages/loading/page.jsx"

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <Loading></Loading>
    }

    return isAuthenticated? <Outlet/> : <Navigate to="/auth" replace/>
}

export default PrivateRoute;