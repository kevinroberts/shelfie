const Authentication = require('./controllers/authentication-controller');
const ClipController = require('./controllers/clip-controller');
const TagController = require('./controllers/tag-controller');
const UploadController = require('./controllers/uploads-controller');
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

  // handle clip related requests
  app.get('/clips', ClipController.getClips);
  app.get('/clip', ClipController.findClip);
  app.post('/clip', requireAuth, ClipController.createClip);
  app.post('/edit-clip', requireAuth, ClipController.editClip)

  // handle tag related requests
  app.post('/tag', requireAuth, TagController.createTag);
  app.get('/tags', TagController.getTags);

  // handle user uploads
  app.post("/uploads", requireAuth, UploadController.onUpload);
  app.delete("/uploads/:uuid", UploadController.onDeleteFile);


  // Express only serves static assets in production
  if (process.env.NODE_ENV === 'production') {


    // app.use((req, res, cb) => {
    //   res.status(404).sendFile(Path.join(PUBLIC_DIR, "errors/404.html"))
    // })
    //
    // app.use((err, req, res, cb) => {
    //   res.status(err.status || 500).sendFile(Path.join(PUBLIC_DIR, "errors/500.html"))
    // })

    app.use(express.static('../client'));

    app.get('*', (req, res) => {
      // make user of custom error messages ?  if path does not contain relevant paths?
      res.sendFile(path.resolve('../client/index.html'))
    });
  }

};
