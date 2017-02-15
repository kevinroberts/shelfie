// Main starting point of the application
require('dotenv').config({silent: true})
require('./helpers/pre-run-check')
const path = require('path')
const log = require('./helpers/logging')
const logDirectory = path.join(__dirname, 'log')
const rfs = require('rotating-file-stream')
const fs = require('fs')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
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
// const cors = require('cors')
// require('./queries/db-update') // DB import helper script

// DB Setup
mongoose.connect(process.env.MONGO_CONNECTION_STRING)

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
