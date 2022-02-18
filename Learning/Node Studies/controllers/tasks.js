const Task = require('../models/task')
const asyncWrapper = require('../middleware/asyncWrapper')


const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find({})
    res.status(200).json({ tasks })
})

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body)
        res.status(201).json({ task })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const getSingleTask = async (req, res) => {
    try {
        const { id: taskId } = req.params 
        const task = await Task.findOne({ _id: taskId })
        if (!task) {
            return res.status(404).json({ message: `No task with id: ${taskId}` })
        }
        res.status(200).json({ task })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const updateTask = async (req, res) => {
    try {
        const { id: taskId } = req.params
        const task = await Task.findByIdAndUpdate({ _id: taskId }, req.body , {
            new: true,
            runValidators: true
        })
        if (!task) {
            return res.status(404).json({ message: `No task with id: ${taskId}` })
        }

        res.status(200).json({ id: taskId, data: req.body })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id: taskId } = req.params
        const task = await Task.findOneAndDelete({ _id: taskId })
        if (!task) {
            return res.status(404).json({ message: `No task with id: ${taskId}` })
        }
        res.status(200).json({ task })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
}