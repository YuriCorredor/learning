const express = require('express')
const { getAllEmails, getAllEmailsStatic } = require('../controllers/emails')

const router = express.Router()

router.route('/').get(getAllEmails)
router.route('/static').get(getAllEmailsStatic)

module.exports = router