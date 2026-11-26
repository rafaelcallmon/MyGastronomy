import styles from "./page.module.css"
import { BiFoodMenu } from "react-icons/bi";
import { FaBowlFood } from "react-icons/fa6";
import { LuUser } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function AdminHomePage() {

    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Admin Panel</h1>

                <div className={styles.linksContainer}>
                    <Link to={"/admin/plates"}><button className={styles.linkBtn}><FaBowlFood/>Plates Panel</button></Link>
                    <Link to={"/admin/orders"}><button className={styles.linkBtn}><BiFoodMenu/>Orders Panel</button></Link>
                    <Link to={"/admin/users"}><button className={styles.linkBtn}><LuUser/>Users panel</button></Link>
                    <button className={styles.linkBtn}>Enigma</button>
                </div>
            </div>
        </>
    )
}