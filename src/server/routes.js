// Import dependencies
var passport = require('passport');
var express = require('express');
var jwt = require('jsonwebtoken');

// Load models
var User = require('./models/user');

// Take a mongoose model and return only some fields encoded in jwt
function tokenFromModel(userModel, includedKeys, duration, secret) {
  var user = {};
  includedKeys.forEach(function(key) {
    user[key] = userModel[key]
  });
  return token = jwt.sign(user, secret, {
    expiresIn: duration
  });
}

// Export Routes
module.exports = function(app) {

  // Init Passport middleware
  app.use(passport.initialize());

  // Use passport jwt Strategy
  require('./passport')(passport);

  var apiRoutes = express.Router();

  // Enable cors preflighting
  apiRoutes.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // Register a new user
  apiRoutes.post('/register', function(req, res) {
    if (!req.body.email || !req.body.password || !req.body.username) {
      res.json({success: false, message: 'Fill out all required fields'});
    } else {
      var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      newUser.save(function(err) {
        if (err) {
          if (err.code == 11000) { // Catch mongoose duplicate errors
            var errmsg = err.toJSON().errmsg;
            var duplicate = errmsg.slice(errmsg.indexOf('$') + 1, errmsg.indexOf('_'));
            return res.json({
              success: false,
              invalidFields: [
                {field: duplicate, message: 'Duplicate ' + duplicate}
              ]
            });
          } else if (err.name == 'ValidationError') { // Catch mongoose validation errors
            var errors = Object.keys(err.errors);
            errors = errors.map(function(errName) {
              return {
                field: errName,
                message: err.errors[errName].message
              };
            });
            console.log(err);
            return res.json({
              success: false,
              invalidFields: errors
            });
          } else {
            console.log(err);
            return res.json({
              success: false,
              invalidFields: [
                {field: null, message: 'Unknown error'}
              ]
            });
          }
        }
        var token = tokenFromModel(newUser, ['_id', 'username', 'email', 'role'], app.get('jwtDuration'), app.get('jwtSecret'));
        res.json({success: true, message: 'New user added', token: 'JWT ' + token});
      });
    }
  });

  // Authenticate a user
  apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
      $or: [
        {email: req.body.id},
        {username: req.body.id}
      ]
    }, function(err, user) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (!user) {
        res.send({
          success: false,
          invalidFields: [
            {field: 'id', message: 'User not found'}
          ]
        });
      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            var token = tokenFromModel(user, ['_id', 'username', 'email', 'role'], app.get('jwtDuration'), app.get('jwtSecret'));
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.send({
              success: false,
              invalidFields: [
                {field: 'password', message: 'Password did not match'}
              ]
            });
          }
        });
      }
    });
  });

  // Authenticate jwt before responding
  apiRoutes.get('/stats', passport.authenticate('jwt', {session: false}), function(req, res) {
    res.send('Woot!!! User id: ' + req.user._id);
  });

  app.use('/api', apiRoutes);
}
