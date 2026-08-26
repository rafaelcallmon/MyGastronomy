import { Routes, Route } from "react-router-dom";
import AuthPage from "../pages/auth/page.jsx"
import CartPage from "../pages/cart/page.jsx"
import HomePage from "../pages/home/page.jsx"
import PlatesPage from "../pages/plates/page.jsx"
import ProfilePage from "../pages/profile/page.jsx"
import PrivateRoute from "./privateRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage/>}/>

            <Route path="/" element={<HomePage/>}/>

            <Route element={<PrivateRoute/>}>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/plates" element={<PlatesPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
            </Route>
        </Routes>
    )
}

export default AppRoutes;