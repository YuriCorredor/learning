const mongoose = require('mongoose')

const emailsSentSchema = mongoose.Schema({
    emailFrom: {
        type: String,
        required:[true, 'email sender must be provided.']
    },
    emailTo: {
        type: String,
        required:[true, 'email receiver must be provided.']
    }
})