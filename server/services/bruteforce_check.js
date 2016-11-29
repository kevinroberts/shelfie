const ExpressBrute = require('express-brute');
const MongoStore = require('express-brute-mongo');
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

// Create a Brute force prevention store
const store = new MongoStore(function (ready) {
  MongoClient.connect(process.env.MONGO_CONNECTION_STRING, function(err, db) {
    if (err) throw err;
    ready(db.collection('bruteforce-store'));
  });
});

const requestFailCallback = function (req, res, next, nextValidRequestDate) {
  console.log("request failed bruteforce check");
  let msg = "You've made too many failed attempts in a short period of time, please try again " + moment(nextValidRequestDate).fromNow();
  return res.status(429).send({ field: 'all', error: msg });
};

const handleStoreError = function(message, parent, req) {
  console.log("store error for bruteforce check", message);
};

// No more than 500 login attempts per day per IP
const loginBruteforce = new ExpressBrute(store, {
  freeRetries: 500,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 24*60*60, // 1 day (seconds not milliseconds)
  failCallback: requestFailCallback,
  handleStoreError: handleStoreError
});

// no more than 100 tries per password reset per day
const resetPassBruteforce = new ExpressBrute(store, {
  freeRetries: 100,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 24*60*60, // 1 day (seconds not milliseconds)
  failCallback: requestFailCallback,
  handleStoreError: handleStoreError
});

exports.loginBruteforce = loginBruteforce;
exports.resetPassBruteforce = resetPassBruteforce;


