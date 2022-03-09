
const  getAllEmailsStatic = async (req, res) => {
    throw new Error('testing async errors')
    res.status(200).json({msg: 'testing'})
}

const  getAllEmails = async (req, res) => {
    res.status(200).json({msg: 'this is not a test'})
}

module.exports = {
    getAllEmails,
    getAllEmailsStatic
}