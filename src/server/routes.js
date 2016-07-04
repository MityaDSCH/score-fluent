// Import dependencies
var passport = require('passport');
var express = require('express');

// Load routes
var registerRoute = require('./routes/register');
var authenticateRoute = require('./routes/authenticate');
var timedScoreRoute = require('./routes/timedScore');

// Load libs
var tokenFromModel = require('./libs/tokenFromModel');

// Export Routes
module.exports = function(app) {

  // Init Passport middleware
  app.use(passport.initialize());

  // Use passport jwt Strategy
  require('./passport')(passport);

  var apiRoutes = express.Router();

  // Enable cors
  if (process.env.NODE_ENV !== 'production') {
    apiRoutes.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
  }

  // Register a new user
  apiRoutes.post('/register', registerRoute(app));

  // Authenticate a user
  apiRoutes.post('/authenticate', authenticateRoute(app));

  // Post a score
  apiRoutes.post('/timed-score', passport.authenticate('jwt', {session: false}), timedScoreRoute(app));

  app.use('/api', apiRoutes);
}
