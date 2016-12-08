const Authentication = require('./controllers/authentication-controller');
const ClipController = require('./controllers/clip-controller');
const TagController = require('./controllers/tag-controller');
const passportService = require('./services/passport');
const passport = require('passport');
const path = require('path');
const express = require('express');
const bruteforce = require('./services/bruteforce_check');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {

  app.get('/message', requireAuth, function(req, res) {
    res.send({ message: 'You have successfully authenticated' });
  });
  app.get('/profile', requireAuth, Authentication.getProfile);
  app.post('/signin', bruteforce.loginBruteforce.prevent, requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
  app.post('/profile', requireAuth, Authentication.editProfile);
  app.post('/reset-request', bruteforce.resetPassBruteforce.prevent, Authentication.resetRequest);
  app.post('/reset/:token', Authentication.resetPassword);
  app.get('/clip', ClipController.getClips);
  app.post('/clip', requireAuth, ClipController.createClip);
  app.post('/tag', requireAuth, TagController.createTag);
  app.get('/tags', TagController.getTags);


  // Express only serves static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../client'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve('../client/index.html'))
    });
  }

};
