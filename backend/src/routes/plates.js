import express from 'express'
import PlatesControllers from '../controllers/plates.js'
import authMiddleware from '../middlewares/auth.js'
import adminMiddleware from '../middlewares/admin.js'

const platesRouter = express.Router()

const platesControllers = new PlatesControllers()

// Todos os pratos
platesRouter.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { success, statusCode, body } = await platesControllers.getPlates()

    res.status(statusCode).send({ success, statusCode, body })
})

// Só os disponíveis
platesRouter.get('/availables', async (req, res) => {
    const { success, statusCode, body } = await platesControllers.getAvailablePlates()

    res.status(statusCode).send({ success, statusCode, body })
})

// Adicionar vários pratos
platesRouter.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { success, statusCode, body } = await platesControllers.addMultiplePlates(req.body)

    res.status(statusCode).send({ success, statusCode, body})
})

// Deletar prato
platesRouter.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { success, statusCode, body } = await platesControllers.deletePlate(req.params.id)

    res.status(statusCode).send({ success, statusCode, body })
})

// Atualizar dados do pratos
platesRouter.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { success, statusCode, body } = await platesControllers.updatePlate(req.params.id, req.body)

    res.status(statusCode).send({ success, statusCode, body })
})

export default platesRouter