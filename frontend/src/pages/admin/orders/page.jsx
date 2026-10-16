import { useAuth } from "../../../contexts/authContext"
import orderServices from "../../../services/order.jsx"
import { LuLogOut, LuTimer, LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import Loading from "../../loading/page.jsx"
import { useEffect, useState } from "react"
import styles from "./page.module.css"
import { LuChevronDown, LuChevronUp, LuTrash } from "react-icons/lu";
import ConfirmDeleteOrderPopup from "../../../components/confirmDeleteOrderPopup/confirmDeleteOrderPopup.jsx";

export default function AdminOrdersPage() {
    const { logout } = useAuth()
    const { getAllOrders, ordersList, refetchOrders, cancelOrder } = orderServices()
    const [ selectedStatus, setSelectedStatus ] = useState('All')
    const [ sortOrder, setSortOrder ] = useState('newest')
    const [ selectedMonth, setSelectedMonth ] = useState("all")
    const [ selectedYear, setSelectedYear ] = useState("all")
    const [ selectedDate, setSelectedDate ] = useState("")
    const [ valueToSearch, setValueToSearch ] = useState('')
    const [ expandedOrderItemsList, setexpandedOrderItemsList] = useState([])
    const [orderToCancel, setOrderToCancel] = useState(null)
    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if (refetchOrders) {
            getAllOrders(authData?.token)
        }
    }, [refetchOrders])

    if (!ordersList) {
        return <Loading></Loading>
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

    const filteredOrders = ordersList.filter(order => {
        const checkStatus = selectedStatus === 'All'? true : order.pickUpStatus === selectedStatus
        const checkValueToSearch = order.userDetails[0].fullname.toLowerCase().includes(valueToSearch.toLowerCase()) || order.userDetails[0].email.toLowerCase().includes(valueToSearch.toLowerCase()) 

        // Verificando data
        const orderDate = getOrderDate(order)
        
        const dateToCompareInfo = selectedDate.split("-")

        const dateToCompare = selectedDate === "" ? null : new Date(dateToCompareInfo[0], dateToCompareInfo[1] - 1, dateToCompareInfo[2])

        const checkDate = selectedDate === "" ? true : orderDate.getDate() === dateToCompare.getDate() && orderDate.getMonth() === dateToCompare.getMonth() && orderDate.getFullYear() === dateToCompare.getFullYear()
        
        // Verififcando ano e mês
        const checkMonth = selectedMonth === "all" ? true : orderDate.getMonth() === parseInt(selectedMonth)

        const checkYear = selectedYear === "all" ? true : orderDate.getFullYear() === parseInt(selectedYear)

        console.log(orderDate.getMonth())
        console.log(parseInt(selectedMonth));
        

        return checkStatus && checkValueToSearch && checkDate && checkMonth && checkYear
    })

    const sortedOrders = sortOrder === "newest" ? [...filteredOrders].sort((a, b) => { return getOrderDate(b).getTime() - getOrderDate(a).getTime() }) : 
    [...filteredOrders].sort((a, b) => { return getOrderDate(a).getTime() - getOrderDate(b).getTime() }) 
    
    const handleClosePopup = () => {
        setOrderToCancel(null)
    }

    const handleConfirmCancel = (orderId) => {
        // BOTAR AWAIT
        cancelOrder(orderId, authData?.token)
        setOrderToCancel(null)
    }

    const handleLogout = () => {
        logout()
    }

    const handleExpandOrder = (orderId) => {
        setexpandedOrderItemsList((currentOrdersIds) => {
            const checkOrderId = currentOrdersIds.find((id) => {
                return id === orderId
            })

            if (checkOrderId) {
                return currentOrdersIds.filter((id) => id !== orderId)
            }

            return [
                ...currentOrdersIds,
                orderId
            ]
        })
    }

        return (
        <div className={styles.pageContainer}>
            <div>
                <h1>{authData?.user?.fullname} (Admin)</h1>
                <h3>{authData?.user?.email}</h3>
            </div>

            <button onClick={handleLogout}>Logout <LuLogOut /></button>

            {ordersList.length > 0 ? 
                <>
                    <div className={styles.filterContainer}>
                        <button onClick={() => setSelectedStatus('All')} className={`${styles.allBtn} ${selectedStatus === 'All' ? styles.selected : ''}`}>All</button>
                        <button onClick={() => setSelectedStatus('Pending')} className={`${styles.pendingBtn} ${selectedStatus === 'Pending' ? styles.selected : ''}`}>Pending</button>
                        <button onClick={() => setSelectedStatus('Completed')} className={`${styles.completedBtn} ${selectedStatus === 'Completed' ? styles.selected : ''}`}>Completed</button>
                        <button onClick={() => setSelectedStatus('Canceled')} className={`${styles.canceledBtn} ${selectedStatus === 'Canceled' ? styles.selected : ''}`}>Canceled</button>
                        <input className={styles.searchInput} type="text" placeholder="Search by name or email" value={valueToSearch} onChange={(event) => setValueToSearch(event.target.value)}/>
                        <button onClick={() => setValueToSearch("")}>Clear</button>
                    </div>

                    <div className={styles.dateFilterContainer}>
                        <div className={styles.dateFilter}>
                            <label htmlFor="">Sort By: </label> 
                            <select name="sortOrders" id="sortOrders" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                                <option value="newest">Newest First</option>    
                                <option value="oldest">Oldest First</option>    
                            </select>
                        </div>
                        <div className={styles.dateFilter}>
                            <label htmlFor="">Date: </label> 
                            <input type="date" value={selectedDate}  onChange={(event) => {
                                setSelectedDate(event.target.value)

                                const selectedDateInfo = event.target.value.split("-")

                                if (selectedDateInfo.length === 3) {
                                    setSelectedMonth(selectedDateInfo[1] - 1)
                                    if (parseInt(selectedDateInfo[0]) >= 2024) {
                                        setSelectedYear(selectedDateInfo[0])
                                    }
                                }
                                
                            }}>
                            </input>
                        </div>
                        <div className={styles.monthFilter}>
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
                        <div className={styles.monthFilter}>
                            <label htmlFor="">Year: </label> 
                            <select name="selectedYear" id="selectedYear" value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
                                <option value="all">All</option>
                                <option value="2026">2026</option>    
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>    
                            </select>
                        </div>
                        <button onClick={resetAllFilters}>
                            Reset Filters
                        </button>
                        
                    </div>

                    {sortedOrders.length === 0 ? 
                        <div className={styles.noOrderCard}>
                            No orders found
                        </div>
                    
                    :

                    <div className={styles.ordersContainer}>
                        {sortedOrders.map((order) => (
                            <div key={order._id} className={styles.orderCard}>
                                <div className={styles.orderHeadContainer}>
                                    {order.pickUpStatus === 'Pending' ? <p className={`${styles.pickUpStatus} ${styles.pending}`}> <LuTimer /> {order.pickUpStatus} </p> : null}
                                    {order.pickUpStatus === 'Completed' ? <p className={`${styles.pickUpStatus} ${styles.completed}`}> <LuCircleCheck /> {order.pickUpStatus} </p> : null}
                                    {order.pickUpStatus === 'Canceled' ? <p className={`${styles.pickUpStatus} ${styles.canceled}`}> <LuCircleAlert /> {order.pickUpStatus}</p> : null}

                                    <div>User: {order.userDetails[0].email}</div>
                                </div>
                                <div className={styles.userDetailsContainer}>
                                    <div>Name: {order.userDetails[0].fullname}</div>
                                    <div>PickupTime: {order.pickupTime}</div>   
                                </div>
                                <div className={styles.itemsHeaders} onClick={() => {handleExpandOrder(order._id)}}>
                                    { expandedOrderItemsList.find((id) => {return id === order._id}) ? <LuChevronUp/> : <LuChevronDown/> }
                                    <div>Items:</div>
                                </div>
                                {expandedOrderItemsList.find((id) => {return id === order._id}) && (
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
                                    <button className={styles.cancelOrderBtn} onClick={() => {setOrderToCancel(order)}}><LuTrash/> Cancel order</button>
                                )}
                            </div>
                        ))}
                    </div>
                        
                    } 
                </>

                :

                <div className={styles.noOrderCard}>
                    No orders registered yet.
                </div>
            }

            {orderToCancel && (
                <ConfirmDeleteOrderPopup onClose={handleClosePopup} onConfirm={() => {handleConfirmCancel(orderToCancel._id)}}></ConfirmDeleteOrderPopup>
            )}

        </div>
    )

}