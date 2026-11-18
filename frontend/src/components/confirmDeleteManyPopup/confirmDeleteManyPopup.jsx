import { useState } from "react"
import styles from "./confirmDeleteManyPopup.module.css"
import { Dialog } from "@mui/material"
import platesServices from "../../services/plates"
import { LuChevronDown, LuChevronUp} from "react-icons/lu";

export default function ConfirmDeleteManyPopup ({onClose, platesToDelete}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const { deletePlate } = platesServices()
    const authData = JSON.parse(localStorage.getItem('auth'))

    return (
        <Dialog open={true} onClose={onClose}>
            <div className={styles.popupContainer}>
                <div className={styles.text}>
                    <b>Confirm the deletion of {platesToDelete.length} plates?</b> 
                </div>

                <div className={styles.expandDiv} onClick={() => setIsExpanded(!isExpanded)}> 
                    {isExpanded ? <LuChevronUp/> : <LuChevronDown/>} <b>Selected plates:</b> 
                </div>
                {isExpanded && (
                <div className={styles.platesDiv}>
                    {platesToDelete.map((plate) => (
                        <div key={plate._id}>{plate.name}</div>
                    ))}
                </div>)}

                <div className={styles.btnsDiv}>
                    <button>Confirm Deletion</button>
                    <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                </div>
            </div>
        </Dialog>
    )
}