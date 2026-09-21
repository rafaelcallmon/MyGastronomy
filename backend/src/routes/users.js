import express from 'express'
import UsersControllers from '../controllers/users.js'
import authMiddleware from '../middlewares/auth.js'
import adminMiddleware from '../middlewares/admin.js'

const usersRouter = express.Router()

const usersControllers = new UsersControllers()

// Pega todos os usuários
usersRouter.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { success, statusCode, body } = await usersControllers.getUsers()

    res.status(statusCode).send({ success, statusCode, body })
})

// Deletar usuário
usersRouter.delete('/:id', authMiddleware, async (req, res) => {
    const { success, statusCode, body } = await usersControllers.deleteUser(req.params.id)

    res.status(statusCode).send({ success, statusCode, body })
})

// Atualizar usuário
usersRouter.put('/:id', authMiddleware, async (req, res) => {
    const { success, statusCode, body } = await usersControllers.updateUser(req.params.id, req.body)

    res.status(statusCode).send({ success, statusCode, body })
})

export default usersRouter