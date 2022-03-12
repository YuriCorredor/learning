const User = require('../models/users')

const login = async (req, res) => {
    res.status(200).json({})
}

const register = async (req, res) => {
    const { email, name, password } = req.body
    const user = await User.create({ email, name, password })

    res.status(200).json({ user })
}


module.exports = {
    login,
    register
}