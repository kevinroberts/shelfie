const bunyan = require('bunyan')
module.exports = bunyan.createLogger({
  name: 'shelfie',
  level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug'
})
