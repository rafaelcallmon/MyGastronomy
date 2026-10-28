import { useEffect, useState } from "react";
import platesServices from "../../../services/plates";
import styles from "./page.module.css"
import Loading from "../../loading/page.jsx"
import { LuPlus } from "react-icons/lu";
import { Navigate } from "react-router-dom";
import AdminPlateCard from "../../../components/adminPlateCard/adminPlateCard.jsx"
import AddPlatePopup from "../../../components/addPlatePopup/addPlatePopup.jsx";
import ConfirmDeletePlatePopup from "../../../components/confirmDeletePlatePopup/confirmDeletePlatePopup.jsx";
import ToastMessage from "../../../components/toastMessage/toastMessage.jsx";

export default function AdminPlatesPage() {
    const { getAvailablePlates, platesList, getAllPlates, addPlate, refetchPlates } = platesServices()
    const [ addPlatePopupOpen, setAddPlatePopupOpen ] = useState(false)
    const [ deletePlatePopupOpen, setDeletePlatePopupOpen ] = useState(false)
    const [ plateToDelete, setPlateToDelete ] = useState(null)
    const [toast, setToast] = useState({
            visible: false,
            message: "",
            type: 'success'
    })
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

    const hideToast = () => {
        setToast((prev) => ({
            ...prev,
            visible: false,
        }))
    }

    const handleAddPlateOpen = (e) => {
        e.preventDefault()

        setAddPlatePopupOpen(!addPlatePopupOpen)
        getAllPlates(authData?.token)
    }

    const handleDeletePlateOpen = (e) => {
        e.preventDefault()

        setDeletePlatePopupOpen(!addPlatePopupOpen)
        getAllPlates(authData?.token)
    }

    const handleDeletePlatePopupClose = (e) => {
        setPlateToDelete(null)
    }

    const handlePlateDeleted = (plateName) => {
        getAllPlates(authData?.token)
        setPlateToDelete(null)

        setToast({
            visible: true,
            message: `Prato "${plateName}" excluído com sucesso`,
            type: "success"
        });
    }

    const handleDeleteError = (message) => {
        setToast({
            visible: true,
            message: message || "Não foi possível excluir o prato.",
            type: "error"
        });
    };
    

    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Plates Panel</h1>

                <div className={styles.searchBar}>
                    <input className={styles.searchInput} type="text" name="" id="" placeholder="Search plate by name"/>
                    <button className={styles.addBtn} onClick={handleAddPlateOpen}><LuPlus/>Add Plate</button>
                </div>

                <div className={styles.platesContainer}>
                    {
                        platesList.map((plate) => (
                            <div key={plate._id} className={styles.cardContainer}>
                                <AdminPlateCard plateData={plate}/>
                                <div className={styles.platesBtnsContainer}>
                                    <button className={styles.editBtn}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => {
                                        setPlateToDelete(plate)
                                        handleDeletePlateOpen()
                                    }}>Delete</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <AddPlatePopup open={addPlatePopupOpen} onClose={handleAddPlateOpen}></AddPlatePopup>

            {plateToDelete && (<ConfirmDeletePlatePopup onClose={handleDeletePlatePopupClose} onDeleteError={handleDeleteError} onDeleted={handlePlateDeleted} plate={plateToDelete}></ConfirmDeletePlatePopup>)}

            <ToastMessage visible={toast.visible} onHide={hideToast} message={toast.message} type={toast.type}></ToastMessage>
        </>
    )
}