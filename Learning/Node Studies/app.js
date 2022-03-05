require('dotenv').config()
const express = require('express')
const notFoundMiddleware = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/errorHandler')
const connectDB = require('./db/connect')
const emailsRouter = require('./routes/emails')

const app = express()

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGO_URI

//middlewares
app.use(express.json())

app.use('/api/v1/emails', emailsRouter)

//middlewares for handeling errors
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        connectDB(mongoUri)
        app.listen(port, console.log(`Server is listening on port: ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()