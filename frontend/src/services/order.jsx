import { useState } from "react";

export default function orderServices() {
    const [ orderLoading, setOrderLoading ] = useState(true)
    const [ refetchOrders, setRefetchOrders ] = useState(true)
    const [ ordersList, setOrdersList ] = useState(null)
    
    const url = 'http://localhost:3000/orders'

    const getUserOrders = (userId, token) => {
        setOrderLoading(true)

        fetch(`${url}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.success) {
                setOrdersList(result.body)
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setOrderLoading(false)
            setRefetchOrders(false)
        })

    }

    const getAllOrders = (token) => {
        setOrderLoading(true)

        fetch(`${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((respone) => respone.json())
        .then((result) => {
            if (result.success) {
                setOrdersList(result.body)
            } else {
                console.log(result)
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setOrderLoading(false)
            setRefetchOrders(false)
        })
    }

    const sendOrder = (orderData, token) => {

        fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            
        })

    }

    const cancelOrder = async (orderId, token) => {
        try {
            const respone = await fetch(`${url}/cancel/${orderId}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const result = await respone.json()

            console.log(result);
            
            if (result.success) {
                setRefetchOrders(true)
            }

            return result
        } catch (error) {
            console.log(error);
        }
    }

    return { getUserOrders, getAllOrders, orderLoading, refetchOrders, setRefetchOrders, ordersList, sendOrder, cancelOrder }
}