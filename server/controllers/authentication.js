const jwt = require('jwt-simple'),
  User = require('../models/user'),
  async = require('async'),
  crypto = require('crypto'),
  emailer = require('../services/email-helper'),
  Checkit = require('checkit'),
  Validator = require('../helpers/checkit-validation'),
  xss = require('xss');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.APP_SECRET);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user), username: req.user.username, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName });
};

exports.signup = function(req, res, next) {
  const signupValidator = new Checkit(Validator.signUpValidation);
  signupValidator.run(req.body).then((validated)=>{
    console.log('form validated', validated);

    // See if a user with the given email exists
    User.findOne({ username: req.body.username }, function(err, existingUserWithUsername) {
      if (err) { return next(err); }

      // If a user with email does exist, return an error
      if (existingUserWithUsername) {
        return res.status(422).send({ _error: 'username is in use' });
      }

      User.findOne({ email: req.body.email }, function(err, existingUserWithEmail) {
        if (err) { return next(err); }

        if (existingUserWithEmail) {
          return res.status(422).send({ _error: 'Email is in use' });
        }

        // If a user with email does NOT exist, create and save user record
        const user = new User({
          email: req.body.email,
          firstName: xss(req.body.firstName, {}),
          lastName: xss(req.body.lastName, {}),
          username: xss(req.body.username, {}),
          password: req.body.password
        });

        user.save(function(err) {
          if (err) { return next(err); }
          // Respond to request indicating the user was created
          res.json({ token: tokenForUser(user), username: user.username, email: user.email, firstName: user.firstName, lastName: user.firstName });
        });
      });
    });

  }).catch( function(err) {
    console.log(err);
    return res.status(422).send(err.toJSON());
  });


};

exports.resetRequest = function (req, res, next) {
  const resetValidator = new Checkit(Validator.resetRequestValidation);
  resetValidator.run(req.body).then((validated)=> {
    console.log('form validated', validated);
    const email = req.body.email;
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {

        User.findOne({ email: email }, function(err, user) {
          if (!user) {
            return res.status(422).send({ _error: 'No account with that email address exists'});
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        // send the reset request email ${req.headers.host}
        emailer.sendResetEmail(user.email, `${process.env.HOST_URL}/resetPassword/${token}`, function (error, reponse) {
          done(error, reponse);
        });
      }
    ], function(err, response) {
      if (err) {
        console.log('error sending reset request', err);
        return res.status(422).send({ _error: 'Error with sending email - please try again'});
      } else {
        return res.json({message: `An e-mail has been sent to ${email} with further instructions.`});
      }

    });

  }).catch( function(err) {
    console.log(err);
    return res.status(422).send(err.toJSON());
  });

};

exports.resetPassword = function (req, res, next) {
  const resetValidator = new Checkit(Validator.resetPasswordValidation);
  resetValidator.run(req.body).then((validated)=> {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            return res.status(422).send({ _error: 'Password reset token is invalid or has expired.'});
          }

          user.password = req.body.password;
          user.updatedAt = new Date();
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            done(err, user);
          });
        });
      },
      function(user, done) {
        // send the user a confirmation email that their password has just been changed
        emailer.sendPasswordChangedEmail(user.email, user.username, function (error, response) {
          done(error, response);
        });
      }
    ], function(err, response) {
      if (err) {
        console.error("an error has occurred trying to send password change email", err);
      } else {
        return res.json({message: `The password for your account has been updated.`});
      }
    });

  }).catch( function(err) {
    console.log(err);
    return res.status(422).send(err.toJSON());
  });
};

exports.getProfile = function (req, res, next) {
  const username = req.query.username;
  const authedUser = req.user;
  if (!username) {
    return res.status(422).send({ field: 'username', error: 'You must provide username'});
  }

  // find profile of given username
  User.findOne({ username: username }, function(err, userProfile) {
    if (err) { return next(err); }

    let user = { isOwnProfile: false };

    if (authedUser.username === userProfile.username) {
      user.isOwnProfile = true;
    }

    user.username = userProfile.username;
    user.email = userProfile.email;
    user.firstName = userProfile.firstName;
    user.lastName = userProfile.lastName;
    user.createdAt = userProfile.createdAt;

    res.json({ user });
  });

};

exports.editProfile = function (req, res, next) {

  const editProfileValidator = new Checkit(Validator.editProfileValidation);
  editProfileValidator.run(req.body).then((validated)=> {
    const authedUser = req.user;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    let changed = false;
    let passChanged = false;

    async.waterfall([
      function (done) {

        User.findOne({ username: authedUser.username }, function(err, userProfile) {
          if (err) { return next(err); }

          if (firstName && lastName) {
            userProfile.firstName = xss(firstName, {});
            userProfile.lastName = xss(lastName, {});
            changed = true;
          }
          if (password) {
            userProfile.password = password;
            changed = true;
            passChanged = true;
          }

          if (changed) {
            userProfile.updatedAt = new Date();

            userProfile.save(function(err) {
              if (err) { return next(err) }

              userProfile.message = "Profile updated successfully.";
              if (passChanged) {
                userProfile.message = "Your password has been updated successfully. Please sign in with your new password to continue."
              }

              done(err, userProfile);

            });

          } else {
            userProfile.message = "No changes were processed.";
            done(err, userProfile);
          }

        });


      }, function (user, done) {
        if (passChanged) {
          emailer.sendPasswordChangedEmail(user.email, user.username, function (error, response) {
            done(error, user);
          });
        } else {
          done(null, user);
        }
      }
    ], function (err, user) {
      if (err) {
        console.error("an error has occurred trying to edit profile", err);
      } else {
        return res.json({ message: user.message, firstName : user.firstName, lastName : user.lastName, email: user.email, isOwnProfile: true });
      }

    });

  }).catch( function(err) {
    console.log("error trying to validate edit profile", err);
    return res.status(422).send(err.toJSON());
  });


};