import { useEffect, useState } from "react"
import styles from "./page.module.css"
import usersServices from "../../../services/users"
import Loading from "../../loading/page.jsx"
import UserCard from "../../../components/userCard/userCard.jsx"

export default function AdminUsersPage() {
    const [searchValue, setSearchValue] = useState("")
    const { getAllUsers, refetchUsers, usersLoading, usersList } = usersServices()
    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if (refetchUsers) {
            getAllUsers(authData?.token)
        }
    }, [refetchUsers])

    if (usersLoading) {
        return <Loading></Loading>
    }
    
    console.log(usersList);
    

    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Users Admin Panel</h1>

                <div className={styles.searchBar}>
                    <input type="text" placeholder="Search a user by name or email" className={styles.searchInput} />
                </div>

                <div className={styles.filterContainer}>
                    <div className={styles.filter}>
                        <label htmlFor="">Sort by:</label>
                        <select name="sort" id="sort">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name</option>
                        </select>
                    </div>

                    <div className={styles.filter}>
                        <label htmlFor="">Role:</label>
                        <select name="role" id="role">
                            <option value="all">All</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className={styles.usersContainer}>
                    
                    {usersList.map(user => {
                        return (
                            <UserCard user={user}></UserCard>
                        )
                    })}
                </div>
            </div>
        </>
    )
}