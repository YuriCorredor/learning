const User = require('../models/users')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
    const { email, name, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ msg: `User with email ${email} was not found.` })

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) return res.status(401).json({ msg: `Email or password is wrong.` })

    res.status(200).json({ msg: 'Logged In!' })
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