import { Link } from "react-router-dom";
import styles from "./userCard.module.css"
import { LuUser, LuSearch } from "react-icons/lu";

export default function ({user}) {

    return (
        <div className={styles.cardContainer}>
            <div><LuUser/></div>
            <div>Name: {user.fullname}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
            
            <Link to={`/admin/users/view/${user._id}`} className={styles.btn}>
                <button className={styles.btn}><LuSearch/>View details</button>
            </Link>
        </div>
    )
}