import { useEffect, useState } from "react";
import platesServices from "../../../services/plates";
import styles from "./page.module.css"
import Loading from "../../loading/page.jsx"
import { LuPlus, LuSquarePen, LuTrash } from "react-icons/lu";
import { Navigate } from "react-router-dom";
import PlateCard from "../../../components/plateCard/plateCard.jsx"
import AddPlatePopup from "../../../components/addPlatePopup/addPlatePopup.jsx";
import ConfirmDeletePlatePopup from "../../../components/confirmDeletePlatePopup/confirmDeletePlatePopup.jsx";
import ToastMessage from "../../../components/toastMessage/toastMessage.jsx";
import UpdatePlatePopup from "../../../components/updatePlatePopup/updatePlatePopup.jsx";
import AdminPlatePopup from "../../../components/adminPlatePopup/adminPlatePopup.jsx";

export default function AdminPlatesPage() {
    const { getAvailablePlates, platesList, getAllPlates, addPlate, refetchPlates } = platesServices()
    const [ addPlatePopupOpen, setAddPlatePopupOpen ] = useState(false)
    const [ plateSelected, setPlateSelected ] = useState(null)
    const [ plateToDelete, setPlateToDelete ] = useState(null)
    const [ plateToUpdate, setPlateToUpdate ] = useState(null)
    const [ nameToSearch, setNameToSearch ] = useState('')
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

    const filteredPlates = platesList.filter(plate => {
        const checkName = plate.name.toLowerCase().includes(nameToSearch.toLowerCase())

        return checkName
    })

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

        getAllPlates(authData?.token)
    }

    const handleDeletePlatePopupClose = () => {
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
    

    const handlePlateUpdated = (plateName) => {
        getAllPlates(authData?.token)

        setPlateToUpdate(null)
        setToast({
            visible:true,
            message: `Prato "${plateName}" atualizado com sucesso`,
            type: "success"
        })
    }

    const handleUpdateError = (message) => {
        setToast({
            visible: true,
            message: message,
            type: "error"
        })
    }

    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Plates Panel</h1>

                <div className={styles.searchBar}>
                    <input className={styles.searchInput} type="text" name="" value={nameToSearch} onChange={(e) => {setNameToSearch(e.target.value); console.log(nameToSearch);
                    }} id="" placeholder="Search plate by name"/>
                    <button className={styles.addBtn} onClick={handleAddPlateOpen}><LuPlus/>Add Plate</button>
                </div>

                <div className={styles.platesContainer}>
                    {
                        filteredPlates.map((plate) => (
                            <div key={plate._id} className={styles.cardContainer} onClick={() => {setPlateSelected(plate)}}>
                                <PlateCard plateData={plate}/>
                                <div className={styles.platesBtnsContainer}>
                                    <button className={styles.editBtn} onClick={() => {
                                        setPlateToUpdate(plate)
                                    }}><LuSquarePen/>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => {
                                        setPlateToDelete(plate)
                                        handleDeletePlateOpen()
                                    }}><LuTrash/>Delete</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <AddPlatePopup open={addPlatePopupOpen} onClose={handleAddPlateOpen}></AddPlatePopup>

            {plateToDelete && (<ConfirmDeletePlatePopup onClose={handleDeletePlatePopupClose} onDeleteError={handleDeleteError} onDeleted={handlePlateDeleted} plate={plateToDelete}></ConfirmDeletePlatePopup>)}

            {plateToUpdate && (<UpdatePlatePopup onClose={() => {setPlateToUpdate(null)}} onUpdateError={handleUpdateError} onUpdated={handlePlateUpdated} plate={plateToUpdate}></UpdatePlatePopup>)}
            
            {plateSelected && (<AdminPlatePopup onClose={() => {setPlateSelected(null)}} plateData={plateSelected}></AdminPlatePopup>)}

            <ToastMessage visible={toast.visible} onHide={hideToast} message={toast.message} type={toast.type}></ToastMessage>
        </>
    )
}