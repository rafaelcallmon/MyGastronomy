import { Dialog } from "@mui/material";
import styles from "./adminPlatePopup.module.css"


export default function AdminPlatePopup ({ plateData, onClose}) {
    return (
        <Dialog open={true} onClose={onClose}>
            <div className={styles.popupContainer}>
                <img src={plateData.imgUrl} alt="" />
                <div className={styles.popupContent}>
                    <h2>{plateData.name}</h2>
                    <p>{String(plateData.ingredients)}</p>
                    <p>{plateData.description}</p>
                    <h3>$ {plateData.price}</h3>
                </div>
            </div>
        </Dialog>
    )
}