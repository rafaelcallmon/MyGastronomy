import { Dialog, TextField } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import styles from "./addPlatePopup.module.css"

export default function AddPlatePopup({open, onClose}) {
    const [ formData, setFormData ] = useState(null)
    const authData = JSON.parse(localStorage.getItem('auth'))
    
    const handleFormatDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        console.log(formData);
        
    }


    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <div className={styles.popupContainer}>
                    <div><b>Please, add your plate's information</b></div>
                    <form onChange={handleFormatDataChange}>
                        <TextField className={styles.textField} placeholder="Name" name="name" required type="text"></TextField>
                        <div className={styles.fieldContainer}>
                            <TextField className={styles.textField} placeholder="Price $" name="price" required type="number"></TextField>
                            <TextField className={styles.textField} placeholder="Category" name="category" required type="text"></TextField>
                        </div>
                        <TextField className={styles.textField} placeholder="Description" name="description" required type="number"></TextField>
                        <TextField className={styles.textField} placeholder="Image Url" name="imgUrl" required type="text"></TextField>
                    </form>
                </div>
            </Dialog>
        </>
    )
}