import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
    const [ cartItems, setCartItems ] = useState([])

    const addToCart = (itemToAdd) => {
        setCartItems((currentItems) => {
            const checkItemAlready = currentItems.find((cartItem) => {
                return cartItem._id === itemToAdd._id
            })

            if (!checkItemAlready) {
                return [
                    ...currentItems,
                    {
                        ...itemToAdd,
                        quantity: 1
                    }
                ]
            }

            return currentItems.map((item) => {
                if (item._id === itemToAdd._id) {
                    return {
                            ...item,
                            quantity: item.quantity + 1
                        }
                    
                }

                return item
            })
        })
    }

    const decreaseItem = (itemToDecrease) => {
        if (itemToDecrease.quantity === 1) {
            removeFromCart(itemToDecrease._id)
            return
        }

        setCartItems((currentItems) => {
            return currentItems.map((item) => {
                if (item._id === itemToDecrease._id) {
                    return {
                        ...item,
                        quantity: item.quantity - 1
                    }
                }

                return item
            })
        })
    }

    const removeFromCart = (itemId) => {
        setCartItems((currentItems) => {
            return currentItems.filter((item) => item._id !== itemId)
        })
    }

    const clearCart = () => {
        setCartItems([])
    }

    return (
        <CartContext.Provider value={{ removeFromCart, addToCart, decreaseItem, clearCart, cartItems }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => {
    const context = useContext(CartContext)

    if (!context) {
        console.log('You are out of CartContext');
    }

    return context
}