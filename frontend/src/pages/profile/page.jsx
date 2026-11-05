import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import orderServices from "../../services/order.jsx"
import styles from "./page.module.css"
import { LuLogOut } from "react-icons/lu";
import Loading from "../loading/page.jsx"
import { useAuth } from "../../contexts/authContext.jsx"
import OrderCard from "../../components/orderCard/orderCard.jsx";
import DatePicker from "react-datepicker";

export default function Profile() {    
    const { logout } = useAuth()
    const { getUserOrders, refetchOrders, ordersList, cancelOrder} = orderServices()
    const [ selectedStatus, setSelectedStatus ] = useState('All')
    const [ sortOrder, setSortOrder ] = useState('newest')
    const [ selectedMonth, setSelectedMonth ] = useState("all")
    const [ selectedYear, setSelectedYear ] = useState("all")
    const [ selectedDate, setSelectedDate ] = useState("")
    const [ valueToSearch, setValueToSearch ] = useState('')
    const selectedDateObject = selectedDate ? new Date(
        Number(selectedDate.split('-')[0]),
        Number(selectedDate.split('-')[1] - 1),
        Number(selectedDate.split('-')[2])
    ) : null

    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if (refetchOrders) {
            getUserOrders(authData.user._id, authData.token);
        }
    }, [refetchOrders]);

    if (!ordersList) {
        return ( <Loading></Loading> )
    }

    const getOrderDate = (order) => {
        const orderPickupData = order.pickupTime.split(" - ")
        const orderTimeInfo = orderPickupData[0].split(":")
        const orderDateInfo = orderPickupData[1].split("/")

        const orderDate = new Date(orderDateInfo[2], orderDateInfo[1] - 1, orderDateInfo[0], orderTimeInfo[0], orderTimeInfo[1])

        return orderDate
    }

    const resetAllFilters = () => {
        setSelectedStatus("All")
        setSortOrder('newest')
        setSelectedMonth('all')
        setSelectedYear('all')
        setSelectedDate("")
        setValueToSearch('')
    }
    
    const filteredOrders = ordersList.filter((order) => {
        const searchValue = valueToSearch.toLowerCase().trim()

        const checkStatus = selectedStatus === "All" ? true : order.pickUpStatus === selectedStatus

        const checkValueToSearch = order.orderItems.some(item => item.itemDetails[0].name.toLowerCase().includes(searchValue))

        const orderDate = getOrderDate(order)

        const dateToCompareInfo = selectedDate.split("-")

        const dateToCompare = selectedDate === "" ? null : new Date(dateToCompareInfo[0], dateToCompareInfo[1] - 1, dateToCompareInfo[2])

        const checkDate = selectedDate === "" ? true : orderDate.getDate() === dateToCompare.getDate() && orderDate.getMonth() === dateToCompare.getMonth() && orderDate.getFullYear() === dateToCompare.getFullYear()

        const checkMonth = selectedMonth === 'all' ? true : orderDate.getMonth() === parseInt(selectedMonth)

        const checkYear = selectedYear === 'all' ? true : orderDate.getFullYear() === parseInt(selectedYear)

        return checkStatus && checkValueToSearch && checkMonth && checkYear && checkDate
    })

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortOrder === "newest") {
            return getOrderDate(b).getTime() - getOrderDate(a).getTime()
        } else if (sortOrder === "oldest") {
            return getOrderDate(a).getTime() - getOrderDate(b).getTime()
        } else if (sortOrder === "lowest") {
            return a.total - b.total
        } else if (sortOrder === "highest") {
            return b.total - a.total
        }
    })
    

    const handleConfirmCancel = async (orderId) => {
        await cancelOrder(orderId, authData?.token)
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <>
            <div className={styles.pageContainer}>
            <div>
                <h1>{authData?.user?.fullname}</h1>
                <h3>{authData?.user?.email}</h3>
            </div>

            <button onClick={handleLogout}>Logout <LuLogOut /></button>

            {ordersList.length > 0 ? 
                <>
                    <div className={styles.filterContainer}>
                        <button onClick={() => setSelectedStatus('All')} className={`${styles.allBtn} ${styles.filterBtn} ${selectedStatus === 'All' ? styles.selected : ''}`}>All</button>
                        <button onClick={() => setSelectedStatus('Pending')} className={`${styles.pendingBtn} ${styles.filterBtn} ${selectedStatus === 'Pending' ? styles.selected : ''}`}>Pending</button>
                        <button onClick={() => setSelectedStatus('Completed')} className={`${styles.completedBtn} ${styles.filterBtn} ${selectedStatus === 'Completed' ? styles.selected : ''}`}>Completed</button>
                        <button onClick={() => setSelectedStatus('Canceled')} className={`${styles.canceledBtn} ${styles.filterBtn} ${selectedStatus === 'Canceled' ? styles.selected : ''}`}>Canceled</button>
                        <input className={styles.searchInput} type="text" placeholder="Search by a plate's name" value={valueToSearch} onChange={(event) => setValueToSearch(event.target.value)}/>
                        <button onClick={() => setValueToSearch("")} className={`${styles.clearBtn} ${styles.filterBtn}`}>Clear</button>
                    </div>

                    <div className={styles.dateFilterContainer}>
                        <div className={styles.dateFilter}>
                            <label htmlFor="">Sort By: </label> 
                            <select name="sortOrders" id="sortOrders" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                                <option value="newest">Newest First</option>    
                                <option value="oldest">Oldest First</option>
                                <option value="lowest">Lowest Total</option>
                                <option value="highest">Highest Total</option>    
                            </select>
                        </div>
                        <div className={styles.dateFilter}>
                            <label htmlFor="">Date: </label> 
                            <DatePicker 
                                selected={selectedDateObject}
                                onChange={(date) => {
                                    if (date) {
                                        const year = date.getFullYear()
                                        const month = String(date.getMonth() + 1).padStart(2, '0')
                                        const day = String(date.getDate()).padStart(2, '0')

                                        setSelectedDate(`${year}-${month}-${day}`)
                                        setSelectedMonth(String(date.getMonth()))

                                        if (year >= 2024) {
                                            setSelectedYear(String(year))
                                        }
                                    } else {
                                        setSelectedDate('')
                                    }
                                }}
                                dateFormat="dd/MM/yyyy"
                                locale="pt-BR"
                                placeholderText="Select a date"
                                isClearable
                                className={styles.datePickerInput}
                            ></DatePicker>
                        </div>
                        <div className={styles.dateFilter}>
                            <label htmlFor="">Month: </label> 
                            <select name="selectedMonth" id="selectedMonth" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
                                <option value="all">All</option>
                                <option value="0">January</option>    
                                <option value="1">February</option>
                                <option value="2">March</option>    
                                <option value="3">April</option>
                                <option value="4">May</option>    
                                <option value="5">June</option>
                                <option value="6">July</option>
                                <option value="7">August</option>
                                <option value="8">September</option>    
                                <option value="9">October</option>
                                <option value="10">November</option>    
                                <option value="11">December</option>    
                            </select>
                        </div>
                        <div className={styles.dateFilter}>
                            <label htmlFor="">Year: </label> 
                            <select name="selectedYear" id="selectedYear" value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
                                <option value="all">All</option>
                                <option value="2026">2026</option>    
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>    
                            </select>
                        </div>
                        <button onClick={resetAllFilters} className={`${styles.resetBtn} ${styles.filterBtn}`}>
                            Reset Filters
                        </button>
                        
                    </div>

                    {sortedOrders.length === 0 ? 
                        <div className={styles.noOrderCard}>
                            No orders found
                        </div>
                    
                    :

                    <div className={styles.ordersContainer}>
                        {sortedOrders.map((order) => {
                            return <OrderCard key={order._id} order={order} onCancel={handleConfirmCancel}></OrderCard>
                        })}
                    </div>
                        
                    } 
                </>

                :

                <div className={styles.noOrderCard}>
                    You do not have orders yet. <br /> <br />
                    <Link to={"/plates"} className={styles.platesLink}>Click here to see our plates</Link>
                </div>
            }

            </div>
        </>
    )
}