import styles from "./page.module.css"
import usersServices from "../../../services/users"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../loading/page.jsx"
import { LuUser } from "react-icons/lu";

export default function UserDetailsPage() {
    const authData = JSON.parse(localStorage.getItem('auth'))
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState("info")
    const {getUserById} = usersServices(authData?.token)
    

    useEffect(() => {
        const fetchUser = async () => {
            const result = await getUserById(id);

            console.log(result);

            setUser(result);
        }

        fetchUser();

    }, [id]);

    if (!user) {
            return <Loading></Loading>
    }

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.userBadge}>
                    <LuUser/> Viewing user: {user.fullname}
                </div>

                <div className={`${styles.pageContent}`}>
                    <div className={styles.optionsContainer}>
                        <button className={`${selectedTab == "info" ? styles.selected : ''}`} onClick={() => setSelectedTab("info")}>View info</button>
                        <button className={`${selectedTab == "orders" ? styles.selected : ''}`} onClick={() => setSelectedTab("orders")}>View orders</button>
                    </div>



                    <div className={styles.menuContent}>
                        {selectedTab == "info" ? (
                            <div>Info</div>
                        ) : (
                            <div>Orders</div>
                        ) }
                    </div>
                </div>
            </div>
        </>
    )
}