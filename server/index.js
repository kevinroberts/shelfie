// Main starting point of the application
require('dotenv').config({silent: true});
require('./helpers/pre-run-check');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
//const cors = require('cors');
// require('./queries/db-update'); // DB import helper script


// DB Setup
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

// App Setup
app.use(morgan('combined'));
//app.use(cors());
app.use(bodyParser.json({limit: '15mb', type: '*/json'}));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
