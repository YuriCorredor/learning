const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET
const jwtRefreshToken = process.env.JWT_REFRESH_TOKEN

const login = async (req, res) => {
    const { email, name, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ msg: `User with email ${email} was not found.` })

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) return res.status(401).json({ msg: `Email or password is wrong.` })

    const refreshToken = jwt.sign({ _id: user._id }, jwtRefreshToken, { expiresIn: '10d' })
    const token = jwt.sign({ refreshToken }, jwtSecret, { expiresIn: '20s' })

    res.status(200).json({ token, refreshToken })
}

const register = async (req, res) => {
    const { email, name, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await User.create({ email, name, password: hashPassword })

    res.status(200).json({ msg: `User ${name} was created!` })
}

const refresh = async (req, res) => {
    const user = req.user
    const refreshToken = req.refreshToken

    console.log(user)
    
    const token = jwt.sign({ refreshToken }, jwtSecret, { expiresIn: '20s' })

    res.status(200).json({ token, refreshToken })
}

module.exports = {
    login,
    register,
    refresh
}