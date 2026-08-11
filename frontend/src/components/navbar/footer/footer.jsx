import styles from './footer.module.css'
import { Link } from "react-router-dom"

export default function Footer () {
    return (
        <footer className={styles.footerContainer}>
            <img src="/imgs/logo.png" alt="" className={styles.logo}/>
            <div>
                Developed by Rafael Calmon. <br />
                <a href="https://github.com/rafaelcallmon" target='_blank'>Click here to see my github!</a>
            </div>
        </footer>
    )
}