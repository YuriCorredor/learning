const mongoose = require('mongoose')

const connectDB = url => {
    console.log('Connecting to mongo database...')
    return mongoose.connect(url)
}

module.exports = connectDB