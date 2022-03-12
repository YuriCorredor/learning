const express = require('express')
const { posts } = require('../controllers/privateTestRoutes')

const router = express.Router()

router.route('/').get(posts)

module.exports = router