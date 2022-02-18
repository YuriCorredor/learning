const express = require('express')
const connectDB = require('./db/connect')
const notFound = require('./middleware/notFound')
const app = express()
const tasks = require('./routes/tasks')
require('dotenv').config()

// middleware
app.use(express.json())

// routes
app.use('/api/v1/tasks', tasks)
app.use(notFound)

const port = 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()