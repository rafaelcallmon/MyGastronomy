import { useState } from "react"
import { useCartContext } from "../../contexts/useCartContext"
import styles from "./page.module.css"
import { LuCircleMinus } from 'react-icons/lu'
import ConfirmOrderPopupPopup from "../../components/confirmOrderPopup/confirmOrderPopup"
import orderServices from "../../services/order"
import { Navigate } from "react-router-dom"

export default function Cart() {
    const { cartItems, addToCart, removeFromCart, decreaseItem, clearCart } = useCartContext()
    const [ confirmPopupOpen, setConfirmPopupOpen ] = useState(false)
    const { sendOrder } = orderServices()
    const authData = JSON.parse(localStorage.getItem('auth'))

    const handleOpenPopup = (e) => {
        e.preventDefault()

        setConfirmPopupOpen(!confirmPopupOpen)
    }

    const handleConfirmOrder = (orderData) => {
        orderData.items = cartItems.map((item) => {
            return { plateId: item._id, quantity: item.quantity }
        })

        sendOrder(orderData)
        clearCart()
        setConfirmPopupOpen(!confirmPopupOpen)
    }

    if (!authData) {
        return <Navigate to="/auth" replace />;
    }

    if (!cartItems.length) {
        return (
            <div>
                <h1>Your cart is empty... :/</h1>
                <button>See our specialities!</button>
            </div>
        )
    }
    
    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Your Items:</h1>
                <section>
                    <div className={styles.itemsListContainer}>
                        {cartItems.map((item) => (
                            <div className={styles.itemContainer} key={item._id}>
                                <img src={item.imgUrl} alt="" />
                                <div className={styles.itemContent}>
                                    <h4>{item.name}</h4>
                                    <p>[{String(item.ingredients)}]</p>
                                    <p>{item.description}</p>
                                    <div className={styles.portionsContainer}>
                                        <div>Portions: {item.quantity}</div>
                                        <div className={styles.portionsBtns}>
                                            <button onClick={() => decreaseItem(item)}>-</button>
                                            <button onClick={() => addToCart(item)}>+</button>
                                        </div>
                                    </div>

                                    <button onClick={() => {removeFromCart(item._id)}}> <LuCircleMinus/> Remove item </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <button className={styles.confirmBtn} onClick={handleOpenPopup}> Confirm your order</button>
            </div>

            <ConfirmOrderPopupPopup open={confirmPopupOpen} onClose={handleOpenPopup} onConfirm={handleConfirmOrder}/>
        </>
    )
}