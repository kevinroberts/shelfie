const passport = require('passport')
const User = require('../models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const log = require('../helpers/logging')

// Create local strategy
const localOptions = { usernameField: 'username' }
const localLogin = new LocalStrategy(localOptions, function (username, password, done) {
  // Verify this username and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false
  const criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username}

  User.findOne(criteria, function (err, user) {
    if (err) { return done(err) }
    if (!user) { return done(null, false) }
    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function (err, isMatch) {
      if (err) { return done(err) }
      if (!isMatch) {
        return done(null, false)
      }

      return done(null, user)
    })
  })
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.APP_SECRET
}

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  const currDate = Math.floor(Date.now() / 1000)
  // if current date time in seconds is greater than expiration
  if (currDate > payload.exp) {
    log.debug('JWT token expired for user with exp: ' + payload.exp)
    return done(null, false)
  }
  User.findById(payload.sub, function (err, user) {
    if (err) { return done(err, false) }

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)
module.exports = passport
