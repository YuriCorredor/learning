require('dotenv').config()
const connectDB = require('./db/connect')
const Emails = require('./models/emails')
const fs = require('fs')
const csv = require('csv-parser')
const mongoUri = process.env.MONGO_URI
let timesLooped = 0

const start = async () => {
    try {
        await connectDB(mongoUri)
        await Emails.deleteMany()
        fs.createReadStream('emails.csv', { encoding: 'utf-8' })
        .pipe(csv())
        .on('data', async row => {
            timesLooped += 1
            const zipCode = row.cep
            const email = row.email
            if (!(email === "")) {
                console.log({email, zipCode})
                console.log(timesLooped)
                await Emails.create({email, zipCode})
            }
        })
        console.log('success!!')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()