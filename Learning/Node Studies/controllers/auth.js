const User = require('../models/users')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
    res.status(200).json({})
}

const register = async (req, res) => {
    const { email, name, password } = req.body

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await User.create({ email, name, password: hashPassword })


    res.status(200).json({ msg: `User ${name} was created!` })
}

module.exports = {
    login,
    register
}