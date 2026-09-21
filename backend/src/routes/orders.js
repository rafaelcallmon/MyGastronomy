import express from 'express'
import OrdersControllers from '../controllers/orders.js'
import authMiddleware from '../middlewares/auth.js'
import adminMiddleware from '../middlewares/admin.js'

const ordersRouter = express.Router()

const ordersControllers = new OrdersControllers()

// Listar todas os pedidos
ordersRouter.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.getOrders()

    res.status(statusCode).send({ success, statusCode, body })
})

// Listar pedidos de um usuário específico
ordersRouter.get('/users/:id', authMiddleware, async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.getOrdersByUserId(req.params.id)

    res.status(statusCode).send({ success, statusCode, body })
})

// Adicionar pedido
ordersRouter.post('/', authMiddleware, async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.addOrder(req.body)

    res.status(statusCode).send({ success, statusCode, body})
})

// Deletar pedido
ordersRouter.delete('/:id', authMiddleware, async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.deleteOrder(req.params.id)

    res.status(statusCode).send({ success, statusCode, body })
})

// Atualizar pedido
ordersRouter.put('/:id', authMiddleware, async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.updateOrder(req.params.id, req.body)

    res.status(statusCode).send({ success, statusCode, body })
})

// Cancelar pedido
ordersRouter.put('/cancel/:id', authMiddleware, async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.cancelOrder(req.params.id, req.user)

    res.status(statusCode).send({ success, statusCode, body })
})

export default ordersRouter