const posts = async (req, res) => {
    res.status(200).json({ msg: 'Super private message.' })
}

module.exports = { posts }