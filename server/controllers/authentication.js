const jwt = require('jwt-simple');
const User = require('../models/user');
const async = require('async');
const crypto = require('crypto');
const emailer = require('../services/email-helper');
const xss = require('xss');

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
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!firstName) {
    return res.status(422).send({ field: 'firstName', error: 'You must provide a first name.'});
  }

  if (!lastName) {
    return res.status(422).send({ field: 'lastName', error: 'You must provide a last name.'});
  }

  if (firstName && firstName.length > 50) {
    return res.status(422).send({ field: 'firstName', error: 'Sorry, we cannot store first names longer than 50 characters.'});
  }

  if (lastName && lastName.length > 50) {
    return res.status(422).send({ field: 'firstName', error: 'Sorry, we cannot store last names longer than 50 characters.'});
  }

  if (!username) {
    return res.status(422).send({ field: 'username', error: 'You must provide username'});
  }

  if (!email || !password) {
    return res.status(422).send({ field: 'all', error: 'You must provide email and password'});
  }

  if (email && email.length > 128) {
    return res.status(422).send({ field: 'firstName', error: 'Sorry, we cannot store email addresses longer than 50 characters.'});
  }

  if (password && password.length < 7) {
    return res.status(422).send({ field: 'all', error: 'Your password must be at least 7 characters in length.'});
  }

  // See if a user with the given email exists
  User.findOne({ username: username }, function(err, existingUserWithUsername) {
    if (err) { return next(err); }

    // If a user with email does exist, return an error
    if (existingUserWithUsername) {
      return res.status(422).send({ field: 'username', error: 'username is in use' });
    }

    User.findOne({ email: email }, function(err, existingUserWithEmail) {
        if (err) { return next(err); }

        if (existingUserWithEmail) {
          return res.status(422).send({ field: 'email', error: 'Email is in use' });
        }

        // If a user with email does NOT exist, create and save user record
        const user = new User({
          email: email,
          firstName: xss(firstName, {}),
          lastName: xss(lastName, {}),
          username: xss(username, {}),
          password: password
        });

        user.save(function(err) {
          if (err) { return next(err); }
          // Respond to request indicating the user was created
          res.json({ token: tokenForUser(user), username: username, email: email, firstName: '', lastName: '' });
        });
    });
  });
};

exports.resetRequest = function (req, res, next) {
  const email = req.body.email;

  if (!email) {
    return res.status(422).send({ field: 'all', error: 'You must provide an email address'});
  }

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
          return res.status(422).send({ field: 'all', error: 'No account with that email address exists'});
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
      console.log(err);
      return res.status(422).send({ field: 'all', error: 'Error with sending email - please try again'});
    } else {
      return res.json({message: `An e-mail has been sent to ${email} with further instructions.`});
    }

  });
};

exports.resetPassword = function (req, res, next) {

  const newPassword = req.body.password;

  if (!newPassword) {
    return res.status(422).send({ field: 'all', error: 'You must provide a password'});
  }

  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.status(422).send({ field: 'all', error: 'Password reset token is invalid or has expired.'});
        }

        user.password = newPassword;
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
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const authedUser = req.user;
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

            userProfile.message = "Profile updated successfully";
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
      emailer.sendPasswordChangedEmail(user.email, user.username, function (error, response) {
        done(error, user);
      });
    }
    ], function (err, user) {
    if (err) {
      console.error("an error has occurred trying to edit profile", err);
    } else {
      return res.json({ message: user.message, firstName : user.firstName, lastName : user.lastName, email: user.email });
    }

  });

};