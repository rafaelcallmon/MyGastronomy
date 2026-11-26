import { Mongo } from "../database/mongo.js"
import { ObjectId } from "mongodb"

const collectionName = 'orders'

export default class OrdersDataAccess {
    async getOrders() {
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $lookup: {
                    from: 'orderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderItems'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails' 
                }
            },
            {
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0
                }
            }
        ])
        .toArray()

        return result
    }

    async getOrdersByUserId(userId) {
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $match: { userId: new ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'orderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderItems'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails' 
                }
            },
            {
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0
                }
            }
        ])
        .toArray()

        return result
    }

    async addOrder(orderData) {
        console.log(orderData);
        
        const { items, ...orderDataRest } = orderData

        await Promise.all(
            items.map(async (item) => {
                const plate = await Mongo.db
                    .collection('plates')
                    .findOne({_id: new ObjectId(item.plateId)})

                if (!plate) {
                    throw new Error(`Plate with id: ${item.plateId} cannot be found`)
                }

                item.name = plate.name
                item.price = plate.price
                item.description = plate.description
                item.ingredients = plate.ingredients
                item.category = plate.category
                item.imgUrl = plate.imgUrl
                item.subtotal = plate.price * item.quantity
            })
        )

        let total = 0

        items.forEach(item => {
            total = total + item.subtotal
        });

        orderDataRest.createdAt = new Date()
        orderDataRest.pickUpStatus = 'Pending'
        orderDataRest.userId = new ObjectId(orderDataRest.userId)
        orderDataRest.total = total

        const newOrder = await Mongo.db
        .collection(collectionName)
        .insertOne(orderDataRest)

        if (!newOrder.insertedId) {
            throw new Error("Order cannot be inserted")
        }

        items.map((item => {
            item.orderId = new ObjectId(newOrder.insertedId)
        }))

        const result = await Mongo.db
        .collection('orderItems')
        .insertMany(items)

        return result
    } 

    async deleteOrder(orderId) {
        const itemsToDelete = await Mongo.db
        .collection('orderItems')
        .deleteMany({orderId: new ObjectId(orderId)})

        const orderToDelete = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(orderId) })

        const result = {
            itemsToDelete,
            orderToDelete
        }

        return result
    }

    async updateOrder(orderId, orderData) {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(orderId) },
                { $set: orderData }
            )

            return result
    }

    async cancelOrder(orderId, user) {
        const order = await Mongo.db
            .collection(collectionName)
            .findOne({_id: new ObjectId(orderId)})

        if (!order) {
            throw new Error("Order not found")
        }

        if (order.userId.toString() !== user._id.toString() && user.role !== 'admin') {
            throw new Error("This order is not yours to delete")
        }

        if (order.pickUpStatus !== 'Pending') {
            throw new Error(`This order cannot be canceled. Pickup status: ${order.pickUpStatus}`)
        }

        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                {_id: new ObjectId(orderId)},
                {$set: {pickUpStatus: 'Canceled'}}
            )

        return result
    }
}