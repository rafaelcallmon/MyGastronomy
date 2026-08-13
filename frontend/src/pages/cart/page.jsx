import { useCartContext } from "../../contexts/useCartContext"
import styles from "./page.module.css"
import { LuCircleMinus } from 'react-icons/lu'

export default function Cart() {
    const { cartItems, addToCart, removeFromCart, decreaseItem } = useCartContext()

    console.log(cartItems);

    if (!cartItems.length) {
        return (
            <div>
                <h1>Your cart is empty... :/</h1>
                <button>See our specialities!</button>
            </div>
        )
    }
    
    return (
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
                                    <p>Portions:</p>
                                    <p>{item.quantity}</p>
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

            <button className={styles.confirmBtn}> Confirm your order</button>
        </div>
    )
}