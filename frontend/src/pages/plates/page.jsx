import platesServices from "../../services/plates.jsx"
import styles from "./page.module.css"
import Loading from "../loading/page.jsx"
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import PlateCard from "../../components/plateCard/plateCard.jsx"
import PlatePopup from "../../components/platePopup/platePopup.jsx"
import { useCartContext } from "../../contexts/useCartContext.jsx"

export default function Plates() {
    const { getAvailablePlates, platesList, platesLoading, refetchPlates } = platesServices()
    const [plateSelected, setPlateSelected] = useState(null)
    const { addToCart } = useCartContext()

    const authData = JSON.parse(localStorage.getItem('auth'))

    const handleSelectedPlate = (plate) => {
        setPlateSelected(plate)
    }

    const handleClosePopup = () => {
        setPlateSelected(null)
    }

    const handleAddToCart = (itemToAdd) => {
        addToCart(itemToAdd);
        handleClosePopup()
    }

    useEffect(() => {
        if (refetchPlates) {
            getAvailablePlates();
        }
    }, [refetchPlates]);

    if (!authData) {
        return <Navigate to="/auth" replace />;
    }

    if (!platesList) {
        return ( <Loading></Loading> )
    }

    
    return (
        <>
            <div>
                {platesList.map((plate) => (
                    <div key={plate._id} className={styles.cardContainer} onClick={() => { handleSelectedPlate(plate) }}>
                        <PlateCard plateData={plate}></PlateCard>
                    </div>
                ))}
            </div>

            {plateSelected && (
                <>
                    <PlatePopup plateData={plateSelected} onClose={handleClosePopup} onAddToCart={handleAddToCart}/>  
                </>
            )}
        </>
    )
}