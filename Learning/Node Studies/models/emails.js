const mongoose = require('mongoose')

const emailsSchema = new mongoose.Schema({
    email: {
        type: String
    },
    zipCode: {
        type: String,
        required:[true, 'Zip code must be provided.']
    }
})

module.exports = mongoose.model('emails', emailsSchema)