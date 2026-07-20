import OrdersDataAccess from "../dataAccess/orders.js"
import {ok, serverError} from "../helpers/httpResponse.js"

export default class OrdersControllers {
    constructor() {
        this.dataAccess = new OrdersDataAccess()
    }

    async getOrders() {
        try {
            const orders = await this.dataAccess.getOrders()

            return ok(orders)
        } catch (error) {
            return serverError(error)
        }
    }

    async getOrdersByUserId(userId) {
        try {
            const orders = await this.dataAccess.getOrdersByUserId(userId)

            return ok(orders)
        } catch (error) {
            return serverError(error)
        }
    }

    async addOrder(ordersData) {
        try {
            const result = await this.dataAccess.addOrder(ordersData) 

            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async deleteOrder(ordersId) {
        try {
            const result = await this.dataAccess.deleteOrder(ordersId)

            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updateOrder(ordersId, ordersData) {
        try {
            const result = await this.dataAccess.updateOrder(ordersId, ordersData)

            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

}