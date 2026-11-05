import { LuTimer, LuCircleAlert, LuCircleCheck, LuTrash, LuChevronDown, LuChevronUp} from "react-icons/lu";
import ConfirmDeleteOrderPopup from "../confirmDeleteOrderPopup/confirmDeleteOrderPopup";
import { useState } from "react";
import styles from "./orderCard.module.css";

export default function OrderCard ({ order, onCancel }) {

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
                {order.pickUpStatus === 'Pending' ? <p className={`${styles.pickUpStatus} ${styles.pending}`}> <LuTimer /> {order.pickUpStatus} </p> : null}
                {order.pickUpStatus === 'Completed' ? <p className={`${styles.pickUpStatus} ${styles.completed}`}> <LuCircleCheck /> {order.pickUpStatus} </p> : null}
                {order.pickUpStatus === 'Canceled' ? <p className={`${styles.pickUpStatus} ${styles.canceled}`}> <LuCircleAlert /> {order.pickUpStatus}</p> : null}
                <div>Order Pickup Time: {order.pickupTime}</div>
                <div className={styles.itemsHeaders} onClick={() => setIsExpanded(prev => !prev)} >
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
                    <button className={styles.cancelOrderBtn} onClick={() => {setOrderToCancel(order)}}><LuTrash/>Cancel</button>
                )}
            </div>

            {orderToCancel && (
                <ConfirmDeleteOrderPopup onClose={() => setOrderToCancel(null)} onConfirm={() => {handleConfirmCancel()}}></ConfirmDeleteOrderPopup>
            )}
        </>
    )
}