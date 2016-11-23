const jwt = require('jwt-simple');
const User = require('../models/user');
const async = require('async');
const crypto = require('crypto');
const emailer = require('../services/email-helper');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.APP_SECRET);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user), username: req.user.username, email: req.user.email  });
};

exports.signup = function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username) {
    return res.status(422).send({ field: 'username', error: 'You must provide username'});
  }

  if (!email || !password) {
    return res.status(422).send({ field: 'all', error: 'You must provide email and password'});
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
          username: username,
          password: password
        });

        user.save(function(err) {
          if (err) { return next(err); }
          // Respond to request indicating the user was created
          res.json({ token: tokenForUser(user), username: username, email: email });
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
      emailer.sendResetEmail(user.email, `http://localhost:8080/resetPassword/${token}`, function (error, reponse) {
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