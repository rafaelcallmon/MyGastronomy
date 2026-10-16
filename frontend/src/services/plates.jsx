import { useState } from "react";

export default function platesServices() {
    const [ platesLoading, setPlatesLoading ] = useState(true)
    const [ refetchPlates, setRefetchPlates ] = useState(true)
    const [ platesList, setPlatesList ] = useState(null)
    
    const url = 'http://localhost:3000/plates'

    const getAvailablePlates = (token) => {
        setPlatesLoading(true)

        fetch(`${url}/availables`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.success) {
                setPlatesList(result.body)
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setPlatesLoading(false)
            setRefetchPlates(false)
        })

    }

    const getAllPlates = (token) => {
        setPlatesLoading(true)

        fetch(`${url}`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.success) {
                setPlatesList(result.body)
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setPlatesLoading(false)
            setRefetchPlates(false)
        })
    }

    return { getAvailablePlates, getAllPlates, platesLoading, refetchPlates, platesList }
}