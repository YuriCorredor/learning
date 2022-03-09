const Emails = require('../models/emails')
const EmailsSent = require('../models/emailsSent')

const emailSent = async (req, res) => {

    const { emailFrom, emailTo } = req.query

    console.log(emailFrom, emailTo)
    const email = await EmailsSent.create({emailFrom, emailTo})
    console.log(email)

    res.status(200).json({})
}

const  getAllEmails = async (req, res) => {

    const { email } = req.query
    const queryObject = {}

    if (email) {
        queryObject.email = { $regex: email, $options: 'i' }
    }

    const emails = await Emails.find(queryObject)
    res.status(200).json({ nbHits: emails.length, emails })
}

module.exports = {
    getAllEmails,
    emailSent
}