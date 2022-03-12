const mongoose = require('mongoose')

const validateEmail = email => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided.'],
        maxLength: 255,
        minLength: 4,
        trim: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email must be provided.'],
        maxLength: 255,
        minLength: 6,
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password must be provided.'],
        maxLength: 5024,
        minLength: 8
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', userSchema)