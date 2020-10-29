const express = require('express')
const app = express()
const db = require('./db')

const port = 3002
app.listen(port, () => {
    console.log("Server running on port 3002")
})