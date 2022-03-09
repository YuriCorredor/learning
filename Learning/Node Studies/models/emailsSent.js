const mongoose = require('mongoose')

const emailsSentSchema = mongoose.Schema({
    emailFrom: {
        type: String,
        required: [true, 'Email sender must be provided.']
    },
    emailTo: {
        type: String,
        required: [true, 'Email receiver must be provided.']
    },
    date: {
        type: Date,
        default: Date.now(),
        required: [true, 'Date must be provided.']
    },
    emailOpened: {
        type: Boolean,
        default: false,
        require: [true, 'emailOpened field must be provided.']
    }
})

module.exports = mongoose.model('EmailSent', emailsSentSchema)