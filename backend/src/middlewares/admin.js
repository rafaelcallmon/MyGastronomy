
export default function adminMiddleware (req, res, next) {
    const user = req.user

    if (user.role !== 'admin') {
        return res.status(403).send({
            success: false,
            message: 'Forbidden'
        })
    }

    next()
}