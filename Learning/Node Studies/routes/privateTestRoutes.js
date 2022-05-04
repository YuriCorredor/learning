const express = require('express')
const { verifyToken } = require('../middleware/auth')
const { posts } = require('../controllers/privateTestRoutes')

const router = express.Router()

router.use(verifyToken).route('/').get(posts)

module.exports = router