import { Dialog } from "@mui/material"
import styles from "./confirmDeleteOrderPopup.module.css"

export default function ConfirmDeleteOrderPopup ({onClose, order, onConfirm}) {
    const handleConfirm = (e) => {
        e.preventDefault()

        onConfirm()
    }

    return (
        <Dialog open={true} onClose={onClose}>
            <div className={styles.popupContainer}>
                <div><b>Confirm the cancelation of the order?</b></div>
                <button className={styles.confirmDeleteBtn} onClick={handleConfirm}>Cancel</button>
            </div>
        </Dialog>
    )
}