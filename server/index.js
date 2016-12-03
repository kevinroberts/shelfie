// Main starting point of the application
require('dotenv').config({silent: true});
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
//const cors = require('cors');

if (!process.env.APP_SECRET) {
  console.error("An APP_SECRET is required - please define one in process env");
}
if (!process.env.MONGO_CONNECTION_STRING) {
  console.error("A mongo db connection string is required - please define one in process env");
}

// DB Setup
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

// App Setup
app.use(morgan('combined'));
//app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
