import { useEffect } from "react"
import { Navigate, useNavigate } from 'react-router-dom'
import authServices from "../../services/auth.jsx"
import orderServices from "../../services/order.jsx"
import styles from "./page.module.css"
import { LuLogOut, LuTimer, LuCircleAlert, LuCircleCheck } from "react-icons/lu";

export default function Profile() {
    const navigate = useNavigate()
    const { logout } = authServices()
    const { getUserOrders, orderLoading, refetchOrders, ordersList } = orderServices()

    const authData = JSON.parse(localStorage.getItem('auth'))

    if (!authData) {
        return <Navigate to="/auth" replace />;
    }

    useEffect(() => {
        if (refetchOrders) {
            getUserOrders(authData.user._id);
        }
    }, [refetchOrders]);

    if (orderLoading) {
        return ( <h1>Loading...</h1> )
    }

    const handleLogout = () => {
        logout()

        navigate("/")
    }

    console.log(ordersList);

    return (
        <div className={styles.pageContainer}>
            <div>
                <h1>{authData?.user?.fullname}</h1>
                <h3>{authData?.user?.email}</h3>
            </div>

            <button onClick={handleLogout}>Logout <LuLogOut /></button>
            
            {ordersList.length > 0 ?
                <div className={styles.ordersContainer}>
                    {ordersList.map((order) => (
                        <div key={order._id} className={styles.orderCard}>
                            {order.pickUpStatus === 'Pending' ? <p className={`${styles.pickUpStatus} ${styles.pending}`}> <LuTimer /> {order.pickUpStatus} </p> : null}
                            {order.pickUpStatus === 'Completed' ? <p className={`${styles.pickUpStatus} ${styles.completed}`}> <LuCircleCheck /> {order.pickUpStatus} </p> : null}
                            {order.pickUpStatus === 'Canceled' ? <p className={`${styles.pickUpStatus} ${styles.canceled}`}> <LuCircleAlert /> {order.pickUpStatus}</p> : null}
                            <h3>{order.pickupTime}</h3>
                            {order.orderItems.map((item) => (
                                <div key={item._id}>
                                    <h4>{item.itemDetails[0].name}</h4>
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

            :

                <div>
                    You do not have orders yet
                </div>
            }

        </div>
    )
}