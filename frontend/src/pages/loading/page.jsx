import { CircularProgress } from "@mui/material"
import styles from "./page.module.css"

export default function () {
    return (
        <div className={styles.loadingPageContainer}>
            <CircularProgress color="inherit"/>
        </div>
    )
}