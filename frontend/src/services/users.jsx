import { useState } from "react"

export default function usersServices(token) {
    const [usersLoading, setUsersLoading] = useState(true)
    const [refetchUsers, setRefetchUsers] = useState(true)
    const [usersList, setUsersList] = useState(null)

    const url = "http://localhost:3000/users"

    const getAllUsers = () => {
        setUsersLoading(true)

        fetch(`${url}`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.success) {
                setUsersList(result.body)
            } else {
                console.log(result)
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setUsersLoading(false)
            setRefetchUsers(false)
        })
    }

    const getUserById = async (userId) => {
        const user = await fetch(`${url}/${userId}`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then((result) => {
            if (result.success) {
                return result.body
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error)
        })

        return user
        
    } 

    return {getAllUsers, getUserById, usersLoading, refetchUsers, usersList}
}