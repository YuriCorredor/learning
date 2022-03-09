const express = require('express')
const { getAllEmails, emailSent } = require('../controllers/emails')

const router = express.Router()

router.route('/').get(getAllEmails)
router.route('/sent').get(emailSent)

module.exports = router