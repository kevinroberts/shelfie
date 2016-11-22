const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const globalBruteforce = require('./services/bruteforce_check');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret code is ABC123' });
  });
  app.get('/profile', requireAuth, Authentication.getProfile);
  app.post('/signin', globalBruteforce.prevent, requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
