const express = require('express')
const { verifyRefreshToken } = require('../middleware/auth')
const { login, register, refresh } = require('../controllers/auth')

const router = express.Router()

router.route('/').get(login)
router.route('/register').post(register)
router.use(verifyRefreshToken).route('/refresh').post(refresh)

module.exports = router