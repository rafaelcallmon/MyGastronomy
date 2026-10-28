import { useEffect, useState } from "react";
import platesServices from "../../../services/plates";
import styles from "./page.module.css"
import Loading from "../../loading/page.jsx"
import { LuPlus } from "react-icons/lu";
import { Navigate } from "react-router-dom";
import AdminPlateCard from "../../../components/adminPlateCard/adminPlateCard.jsx"
import AddPlatePopup from "../../../components/addPlatePopup/addPlatePopup.jsx";

export default function AdminPlatesPage() {
    const { getAvailablePlates, platesList, getAllPlates, addPlate, refetchPlates } = platesServices()
    const [ addPlatePopupOpen, setAddPlatePopupOpen ] = useState(false)
    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if (refetchPlates) {
            getAllPlates(authData?.token)
        }
    }, [refetchPlates])

    if (!authData) {
        return <Navigate to="/auth" replace />;
    }

    if (!platesList) {
        return ( <Loading></Loading> )
    }

    const handleOpenPopup = (e) => {
        e.preventDefault()

        setAddPlatePopupOpen(!addPlatePopupOpen)
        getAllPlates(authData?.token)
    }
    

    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Plates Panel</h1>

                <div className={styles.searchBar}>
                    <input className={styles.searchInput} type="text" name="" id="" placeholder="Search plate by name"/>
                    <button className={styles.addBtn} onClick={handleOpenPopup}><LuPlus/>Add Plate</button>
                </div>

                <div className={styles.platesContainer}>
                    {
                        platesList.map((plate) => (
                            <div key={plate._id} className={styles.cardContainer}>
                                <AdminPlateCard plateData={plate}/>
                                <div className={styles.platesBtnsContainer}>
                                    <button className={styles.editBtn}>Edit</button>
                                    <button className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <AddPlatePopup open={addPlatePopupOpen} onClose={handleOpenPopup}></AddPlatePopup>
        </>
    )
}