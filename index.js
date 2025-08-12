const express = require('express')
const cookieParser = require('cookie-parser')
const api = require('./api')
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api', api)

const PORT = 8000
app.listen(PORT, () => console.log('Server Running'))
