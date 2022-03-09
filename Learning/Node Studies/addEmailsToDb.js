require('dotenv').config()
const connectDB = require('./db/connect')
const Emails = require('./models/emails')
const fs = require('fs')
const csv = require('csv-parser')
const mongoUri = process.env.MONGO_URI

const start = async () => {
    try {
        await connectDB(mongoUri)
        await Emails.deleteMany()
        fs.createReadStream('emails.csv', { encoding: 'utf-8' })
        .pipe(csv())
        .on('data', async row => {
            const zipCode = row.cep
            const email = row.email
            if (!(email === "" || !email)) {
                console.log({email, zipCode})
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