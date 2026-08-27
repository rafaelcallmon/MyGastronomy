import { useAuth } from "../../../contexts/authContext"
import orderServices from "../../../services/order.jsx"
import { LuLogOut, LuTimer, LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import Loading from "../../loading/page.jsx"
import { useEffect, useState } from "react"
import styles from "./page.module.css"

export default function AdminOrdersPage() {
    const { logout } = useAuth()
    const { getAllOrders, ordersList, refetchOrders } = orderServices()
    const [ selectedStatus, setSelectedStatus ] = useState('All')
    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if (refetchOrders) {
            getAllOrders(authData?.token)
        }
    }, [refetchOrders])

    if (!ordersList) {
        return <Loading></Loading>
    }

    const filteredOrders = selectedStatus === 'All'? ordersList : ordersList.filter(order => order.pickUpStatus === selectedStatus)
    console.log(filteredOrders);
    

    const handleLogout = () => {
        logout()
    }

        return (
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
                            We do not have any order with "{selectedStatus}" status yet.
                        </div>
                    
                    :

                    <div className={styles.ordersContainer}>
                        {filteredOrders.map((order) => (
                            <div key={order._id} className={styles.orderCard}>
                                {order.pickUpStatus === 'Pending' ? <p className={`${styles.pickUpStatus} ${styles.pending}`}> <LuTimer /> {order.pickUpStatus} </p> : null}
                                {order.pickUpStatus === 'Completed' ? <p className={`${styles.pickUpStatus} ${styles.completed}`}> <LuCircleCheck /> {order.pickUpStatus} </p> : null}
                                {order.pickUpStatus === 'Canceled' ? <p className={`${styles.pickUpStatus} ${styles.canceled}`}> <LuCircleAlert /> {order.pickUpStatus}</p> : null}
                                <h3>{order.pickupTime}</h3>
                                {order.orderItems.map((item) => (
                                    <div key={item._id} className={styles.orderCardItem}>
                                        <h4>{item.itemDetails[0].name}</h4>
                                        <div>Price: $ {item.price.toFixed(2)}</div>
                                        <div>Quantity: {item.quantity}</div>
                                        <div>Subtotal: $ {item.subtotal.toFixed(2)}</div>
                                    </div>
                                ))}
                                <div>Total: $ {order.total.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                        
                    } 
                </>

                :

                <div className={styles.noOrderCard}>
                    No orders registered yet.
                </div>
            }

        </div>
    )

}