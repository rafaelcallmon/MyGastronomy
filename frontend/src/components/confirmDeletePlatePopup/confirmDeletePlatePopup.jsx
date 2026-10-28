import { Dialog } from "@mui/material"
import styles from "./confirmDeletePlatePopup.module.css"
import platesServices from "../../services/plates"
import ToastMessage from "../toastMessage/toastMessage"
import { useState } from "react"

export default function ConfirmDeletePlatePopup ({onClose, onDeleted, onDeleteError, plate}) {
    const { deletePlate } = platesServices()
    const authData = JSON.parse(localStorage.getItem('auth'))

    const handleConfirm = async (e) => {
        e.preventDefault()

        try {
            const result = await deletePlate(plate._id, authData?.token)

            if (!result.success) {
                    throw new Error(result.body);
                }

            onDeleted(plate.name)
        } catch (error) {
            onDeleteError(error.message)
        }
    }

    return (
        <>
            <Dialog open={true} onClose={onClose}>
                <div className={styles.popupContainer}>
                    <div><b>Confirm the deletion of plate: "{plate.name}"?</b></div>
                    <button className={styles.confirmDeleteBtn} onClick={handleConfirm}>Delete</button>
                </div>
            </Dialog>
        </>
    )
}