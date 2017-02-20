const jwt = require('jwt-simple')
const User = require('../models/user')
const async = require('async')
const crypto = require('crypto')
const emailer = require('../services/email-helper')
const Checkit = require('checkit')
const Validator = require('../helpers/checkit-validation')
const log = require('../helpers/logging')
const xss = require('xss')

function tokenForUser (user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.APP_SECRET)
}

exports.signin = function (req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user),
    username: req.user.username,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    favoriteClips: req.user.favoriteClips })
}

exports.signup = function (req, res, next) {
  const signupValidator = new Checkit(Validator.signUpValidation)
  signupValidator.run(req.body).then((validated) => {
    // See if a user with the given email exists
    User.findOne({ username: validated.username }, function (err, existingUserWithUsername) {
      if (err) { return next(err) }

      // If a user with email does exist, return an error
      if (existingUserWithUsername) {
        return res.status(422).send({ _error: 'username is in use' })
      }

      User.findOne({ email: validated.email }, function (err, existingUserWithEmail) {
        if (err) { return next(err) }

        if (existingUserWithEmail) {
          return res.status(422).send({ _error: 'Email is in use' })
        }

        // If a user with email does NOT exist, create and save user record
        const user = new User({
          email: req.body.email,
          firstName: xss(validated.firstName, {}),
          lastName: xss(validated.lastName, {}),
          username: xss(validated.username, {}),
          password: validated.password
        })

        user.save(function (err) {
          if (err) { return next(err) }
          // Respond to request indicating the user was created
          res.json({ token: tokenForUser(user), username: user.username, email: user.email, firstName: user.firstName, lastName: user.firstName, favoriteClips: [] })
        })
      })
    })
  }).catch(function (err) {
    log.error(err)
    return res.status(422).send(err.toJSON())
  })
}

exports.resetRequest = function (req, res, next) {
  const resetValidator = new Checkit(Validator.resetRequestValidation)
  resetValidator.run(req.body).then((validated) => {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex')
          done(err, token)
        })
      },
      function (token, done) {
        User.findOne({ email: validated.email }, function (err, user) {
          if (err) {
            log.error('error occurred trying to fetch user for reset request', err)
          }
          if (!user) {
            return res.status(422).send({ _error: 'No account with that email address exists' })
          }

          user.resetPasswordToken = token
          user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

          user.save(function (err) {
            done(err, token, user)
          })
        })
      },
      function (token, user, done) {
        // send the reset request email ${req.headers.host}
        emailer.sendResetEmail(user.email, `${process.env.HOST_URL}/resetPassword/${token}`, function (error, reponse) {
          done(error, reponse)
        })
      }
    ], function (err, response) {
      if (err) {
        log.error('error sending reset request', err)
        return res.status(422).send({ _error: 'Error with sending email - please try again' })
      } else {
        return res.json({message: `An e-mail has been sent to ${validated.email} with further instructions.`})
      }
    })
  }).catch(function (err) {
    log.error(err)
    return res.status(422).send(err.toJSON())
  })
}

exports.resetPassword = function (req, res, next) {
  const resetValidator = new Checkit(Validator.resetPasswordValidation)
  resetValidator.run(req.body).then((validated) => {
    async.waterfall([
      function (done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
          if (err) {
            log.error('error occurred trying to fetch user for reset request reset token ' + req.params.token, err)
          }
          if (!user) {
            return res.status(422).send({ _error: 'Password reset token is invalid or has expired.' })
          }

          user.password = validated.password
          user.updatedAt = new Date()
          user.resetPasswordToken = undefined
          user.resetPasswordExpires = undefined

          user.save(function (err) {
            done(err, user)
          })
        })
      },
      function (user, done) {
        // send the user a confirmation email that their password has just been changed
        emailer.sendPasswordChangedEmail(user, function (error, response) {
          done(error, response)
        })
      }
    ], function (err, response) {
      if (err) {
        log.error('an error has occurred trying to send password change email', err)
      } else {
        return res.json({message: `The password for your account has been updated.`})
      }
    })
  }).catch(function (err) {
    log.error(err)
    return res.status(422).send(err.toJSON())
  })
}

exports.getProfile = function (req, res, next) {
  const username = req.query.username
  const profileValidator = new Checkit(Validator.getProfileValidation)

  profileValidator.run(req.query).then((validated) => {
    const authedUser = req.user

    // find profile of given username
    User.findOne({ username: username }, function (err, userProfile) {
      if (err) { return next(err) }

      let user = { isOwnProfile: false }

      if (authedUser) {
        if (authedUser.username === userProfile.username) {
          user.isOwnProfile = true
        }
      }
      user.username = userProfile.username
      user.gravitarMd5 = crypto.createHash('md5').update(userProfile.email).digest('hex')
      user.numberOfFaves = userProfile.favoriteClips ? userProfile.favoriteClips.length : 0
      user.firstName = userProfile.firstName
      user.lastName = userProfile.lastName
      user.createdAt = userProfile.createdAt
      user.clips = userProfile.clips

      res.json({ user })
    })
  }).catch(function (err) {
    log.error(err)
    return res.status(422).send(err.toJSON())
  })
}

exports.editProfile = function (req, res, next) {
  const editProfileValidator = new Checkit(Validator.editProfileValidation)
  editProfileValidator.run(req.body).then((validated) => {
    const authedUser = req.user
    const firstName = validated.firstName
    const lastName = validated.lastName
    const password = validated.password
    let changed = false
    let passChanged = false

    async.waterfall([
      function (done) {
        User.findOne({ username: authedUser.username }, function (err, userProfile) {
          if (err) { return next(err) }

          if (firstName && lastName) {
            userProfile.firstName = xss(firstName, {})
            userProfile.lastName = xss(lastName, {})
            changed = true
          }
          if (password) {
            userProfile.password = password
            changed = true
            passChanged = true
          }

          if (changed) {
            userProfile.updatedAt = new Date()

            userProfile.save(function (err) {
              if (err) { return next(err) }

              userProfile.message = 'Profile updated successfully.'
              if (passChanged) {
                userProfile.message = 'Your password has been updated successfully. Please sign in with your new password to continue.'
              }

              done(err, userProfile)
            })
          } else {
            userProfile.message = 'No changes were processed.'
            done(err, userProfile)
          }
        })
      }, function (user, done) {
        if (passChanged) {
          emailer.sendPasswordChangedEmail(user, function (error, response) {
            done(error, user)
          })
        } else {
          done(null, user)
        }
      }
    ], function (err, user) {
      if (err) {
        log.error('an error has occurred trying to edit profile', err)
      } else {
        return res.json({ message: user.message, firstName: user.firstName, lastName: user.lastName, email: user.email, createdAt: user.createdAt, isOwnProfile: true })
      }
    })
  }).catch(function (err) {
    log.error('error trying to validate edit profile', err)
    return res.status(422).send(err.toJSON())
  })
}
