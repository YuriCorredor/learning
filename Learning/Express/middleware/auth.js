const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET
const jwtRefreshToken = process.env.JWT_REFRESH_TOKEN

const verifyToken = (req, res, next) => {
    const { token } = req.body
    if (!token) return res.status(401).json({ message: 'Token not found.' })

    try {
        const jwtInfo = jwt.verify(token, jwtSecret)
        req.user = jwtInfo
        next()
    } catch (error) {
        res.status(401).json({ message: `Token is invalid.` })
    }
}

const verifyRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token not found.' })

    try {
        const jwtInfo = jwt.verify(refreshToken, jwtRefreshToken)
        req.user = jwtInfo
        req.refreshToken = refreshToken
        next()
    } catch (error) {
        res.status(401).json({ message: `Refresh token is invalid.` })
    }
}

module.exports = {
    verifyToken,
    verifyRefreshToken
}