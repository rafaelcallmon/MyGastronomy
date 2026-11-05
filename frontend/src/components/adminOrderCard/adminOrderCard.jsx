import { useState } from "react";
import styles from "./adminOrderCard.module.css";
import { LuTimer, LuCircleAlert, LuCircleCheck, LuTrash, LuChevronDown, LuChevronUp} from "react-icons/lu";
import ConfirmDeleteOrderPopup from "../confirmDeleteOrderPopup/confirmDeleteOrderPopup";

export default function AdminOrderCard({ order, onCancel }) {

    const [ isExpanded, setIsExpanded] = useState(false)
    const [orderToCancel, setOrderToCancel] = useState(null)

    const handleConfirmCancel = async () => {
        try {
            await onCancel(order._id);
            setOrderToCancel(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className={styles.orderCard}>
                <div className={styles.orderHeadContainer}>
                    {order.pickUpStatus === 'Pending' ? <div className={`${styles.pickUpStatus} ${styles.pending}`}> <LuTimer /> {order.pickUpStatus} </div> : null}
                    {order.pickUpStatus === 'Completed' ? <div className={`${styles.pickUpStatus} ${styles.completed}`}> <LuCircleCheck /> {order.pickUpStatus} </div> : null}
                    {order.pickUpStatus === 'Canceled' ? <div className={`${styles.pickUpStatus} ${styles.canceled}`}> <LuCircleAlert /> {order.pickUpStatus}</div> : null}

                    <div>User: {order.userDetails[0].email}</div>
                </div>
                <div className={styles.userDetailsContainer}>
                    <div>Name: {order.userDetails[0].fullname}</div>
                    <div>PickupTime: {order.pickupTime}</div>   
                </div>
                <div className={styles.itemsHeaders} onClick={() => {setIsExpanded(prev => !prev)}}>
                    { isExpanded ? <LuChevronUp/> : <LuChevronDown/> }
                    <div>Items:</div>
                </div>
                {isExpanded && (
                    <div className={styles.orderItemsContainer}>
                        {order.orderItems.map((item) => (
                            <div key={item._id} className={styles.orderCardItem}>
                                <div>{item.itemDetails[0].name}</div>
                                <div>Price: $ {item.price.toFixed(2)}</div>
                                <div>Quantity: {item.quantity}</div>
                                <div>Subtotal: $ {item.subtotal.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                )}
                <div>Total: $ {order.total.toFixed(2)}</div>
                {order.pickUpStatus === 'Pending' && (
                    <button className={styles.cancelOrderBtn} onClick={() => {setOrderToCancel(order)}}><LuTrash/> Cancel </button>
                )}
            </div>

            {orderToCancel && (
                <ConfirmDeleteOrderPopup onClose={() => setOrderToCancel(null)} onConfirm={() => {handleConfirmCancel()}}></ConfirmDeleteOrderPopup>
            )}
        </>
    )
}