const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET

module.exports = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({ msg: 'Token not found.' })

    try {
        const jwtInfo = jwt.verify(token, jwtSecret)
        req.user = jwtInfo
        next()
    } catch (error) {
        res.status(401).json({ msg: `Token is invalid.` })
    }

}