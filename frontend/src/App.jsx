import Navbar from "./components/navbar/navbar.jsx"
import { BrowserRouter, Outlet } from "react-router-dom"
import Footer from "./components/navbar/footer/footer.jsx"
import { CartProvider } from "./contexts/useCartContext.jsx"
import { AuthProvider } from "./contexts/authContext.jsx"
import AppRoutes from "./routes/appRoutes.jsx"

export default function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar/>
            <main>
                <AppRoutes/>
            </main>
            <Footer/>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}


