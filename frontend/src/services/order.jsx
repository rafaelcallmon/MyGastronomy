import { useState } from "react";

export default function orderServices() {
    const [ orderLoading, setOrderLoading ] = useState(true)
    const [ refetchOrders, setRefetchOrders ] = useState(true)
    const [ ordersList, setOrdersList ] = useState(null)
    
    const url = 'http://localhost:3000/orders'

    const getUserOrders = (userId) => {
        setOrderLoading(true)

        fetch(`${url}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
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

    const sendOrder = (orderData) => {

        fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
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

    return { getUserOrders, orderLoading, refetchOrders, ordersList, sendOrder }
}