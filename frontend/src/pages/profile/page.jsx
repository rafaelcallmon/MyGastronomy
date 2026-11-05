import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import orderServices from "../../services/order.jsx"
import styles from "./page.module.css"
import { LuLogOut } from "react-icons/lu";
import Loading from "../loading/page.jsx"
import { useAuth } from "../../contexts/authContext.jsx"
import OrderCard from "../../components/orderCard/orderCard.jsx";

export default function Profile() {    
    const { logout } = useAuth()
    const { getUserOrders, refetchOrders, ordersList, cancelOrder} = orderServices()
    const [ selectedStatus, setSelectedStatus ] = useState('All')

    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if (refetchOrders) {
            getUserOrders(authData.user._id, authData.token);
        }
    }, [refetchOrders]);

    if (!ordersList) {
        return ( <Loading></Loading> )
    }
    
    const filteredOrders = selectedStatus === 'All' ? ordersList : ordersList.filter(order => order.pickUpStatus === selectedStatus)

    const handleConfirmCancel = async (orderId) => {
        await cancelOrder(orderId, authData?.token)
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <>
            <div className={styles.pageContainer}>
            <div>
                <h1>{authData?.user?.fullname}</h1>
                <h3>{authData?.user?.email}</h3>
            </div>

            <button onClick={handleLogout}>Logout <LuLogOut /></button>

            {ordersList.length > 0 ? 
                <>
                    <div className={styles.filterContainer}>
                        <button onClick={() => setSelectedStatus('All')} className={`${styles.allBtn} ${selectedStatus === 'All' ? styles.selected : ''}`}>All</button>
                        <button onClick={() => setSelectedStatus('Pending')} className={`${styles.pendingBtn} ${selectedStatus === 'Pending' ? styles.selected : ''}`}>Pending</button>
                        <button onClick={() => setSelectedStatus('Completed')} className={`${styles.completedBtn} ${selectedStatus === 'Completed' ? styles.selected : ''}`}>Completed</button>
                        <button onClick={() => setSelectedStatus('Canceled')} className={`${styles.canceledBtn} ${selectedStatus === 'Canceled' ? styles.selected : ''}`}>Canceled</button>
                    </div>

                    {filteredOrders.length === 0 ? 
                        <div className={styles.noOrderCard}>
                            No orders found
                        </div>
                    
                    :

                    <div className={styles.ordersContainer}>
                        {filteredOrders.map((order) => {
                            return <OrderCard key={order._id} order={order} onCancel={handleConfirmCancel}></OrderCard>
                        })}
                    </div>
                        
                    } 
                </>

                :

                <div className={styles.noOrderCard}>
                    You do not have orders yet. <br /> <br />
                    <Link to={"/plates"} className={styles.platesLink}>Click here to see our plates</Link>
                </div>
            }

            </div>
        </>
    )
}