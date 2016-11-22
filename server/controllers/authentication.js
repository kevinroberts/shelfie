const jwt = require('jwt-simple');
const User = require('../models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.APP_SECRET);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user), username: req.user.username, email: req.user.email  });
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
