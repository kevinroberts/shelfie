const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const bruteforce = require('./services/bruteforce_check');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'You have successfully authenticated' });
  });
  app.get('/profile', requireAuth, Authentication.getProfile);
  app.post('/signin', bruteforce.loginBruteforce.prevent, requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
  app.post('/reset-request', bruteforce.resetPassBruteforce.prevent, Authentication.resetRequest);
  app.post('/reset/:token', Authentication.resetPassword);
};
