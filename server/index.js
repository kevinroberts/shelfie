// Main starting point of the application
const path = require('path')
require('dotenv').config({path: path.join(__dirname, './.env'), silent: true})
require('./helpers/pre-run-check')
const log = require('./helpers/logging')
const logDirectory = path.join(__dirname, 'log')
const rfs = require('rotating-file-stream')
const fs = require('fs')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')

// DB Setup
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { userMongoClient: true })
log.info('Mongo connection status: ', mongoose.connection.readyState)

// const cors = require('cors')
require('./queries/db-update') // DB init helper script

// App Setup
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

// app.use(cors())
app.use(bodyParser.json({limit: '15mb', type: '*/json'}))
router(app)
app.disable('x-powered-by')

// Server Setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
log.info('Server listening on:', port)
