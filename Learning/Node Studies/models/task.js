const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'Must provide a name'],
        trim: true,
        maxlength:[25, 'Name cannot be more than 25 chars']
    },
    completed:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task', TaskSchema)