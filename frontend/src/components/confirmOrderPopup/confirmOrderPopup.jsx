import { Dialog, TextField } from "@mui/material";
import styles from "./confirmOrderPopup.module.css"
import { useState } from "react";
import { Navigate } from "react-router-dom";


export default function ConfirmOrderPopupPopup ({ open, onClose, onConfirm }) {
    const [formData, setFormData] = useState(null)
    const authData = JSON.parse(localStorage.getItem('auth'))

    const handleConfirm = (e) => {
        e.preventDefault()

        if (!authData?.user?._id) {
            return <Navigate to="/auth" replace />
        } else {
            if (!formData?.pickupTime) {
                return
            } else {
                const orderData = {
                userId: authData?.user?._id,
                pickupTime: String(formData?.pickupTime + ` - ${(new Date().toLocaleDateString())}`)
                }

                onConfirm(orderData)
            }
        }
    }

    const handleFormatDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <div className={styles.popupContainer}>
                <h2>We're almost there...</h2>
                <p>Confirm your order with the current date: <strong>{(new Date().toLocaleDateString())}</strong> What time will you come to pick up your order?</p>
                <form className={styles.formContainer}>
                        <TextField onChange={handleFormatDataChange} required type="time" name="pickupTime"/>
                        <div className={styles.confirmBtns}>
                            <button onClick={handleConfirm}>Confirm</button>
                            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        </div>
                </form>
            </div>
        </Dialog>
    )
}