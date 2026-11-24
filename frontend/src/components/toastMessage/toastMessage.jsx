import styles from "./toastMessage.module.css"
import { useEffect } from "react";
import { LuCheck, LuX } from "react-icons/lu";

export default function ToastMessage({ visible, message, type="success", onHide }) {
    
    useEffect(() => {
        if (!visible) {
            return
        }

        const timer = setTimeout(() => {
            onHide()
        }, 3000)

        return () => clearTimeout(timer)
    }, [visible, onHide])

    if (!visible) return null

    return (
            <div className={`${styles.container} ${type === "success" ? styles.success : styles.error}`}>
                {type === "success" ? (
                    <LuCheck></LuCheck>
                ) : (
                    <LuX></LuX>
                )}
                <div className={styles.message}>{message}</div>
            </div>
    )
}