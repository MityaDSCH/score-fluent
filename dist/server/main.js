// Module improts
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var passport = require('passport');

// Custom imports
var User = require('./models/user');

// Constants
// time in this format: https://github.com/rauchg/ms.js
var tokenDuration = '7 days';

var app = express();

// Add environment vars
if (process.env.NODE_ENV != 'production') require('dotenv').config();
app.set('jwtSecret', process.env.JWT_SECRET);
var port = process.env.PORT || 9000;

// connect to mongodb
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/score-fluent');

// Use passport jwt Strategy
require('./passport')(passport);

// Parse json and url-encodec middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Log requests middleware
app.use(morgan('dev'));

// Passport middleware
app.use(passport.initialize());

// Serve client
app.use('/', express.static('./dist/client'));

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
var apiRoutes = express.Router();

// Register a new user
apiRoutes.post('/register', function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, message: 'Enter email and password'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    newUser.save(function(err) {
      if (err) {
        console.log(err);
        return res.json({success: false, message: 'Email already in use'});
      }
      var user = {
        role: newUser.role,
        email: newUser.email
      };
      var token = jwt.sign(user, app.get('jwtSecret'), {
        expiresIn: tokenDuration
      });
      res.json({success: true, message: 'New user added', token: 'JWT ' + token});
    });
  }
});

// Authenticate a user
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.send({success: false, message: 'User not found'});
    } else {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          user = {
            role: user.role,
            email: user.email
          };
          var token = jwt.sign(user, app.get('jwtSecret'), {
            expiresIn: tokenDuration
          });
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, message: 'Password did not match'});
        }
      })
    }
  })
});

// Authenticate jwt before responding
apiRoutes.get('/stats', passport.authenticate('jwt', {session: false}), function(req, res) {
  res.send('Woot!!! User id: ' + req.user._id);
});

app.use('/api', apiRoutes);
// ----------------------------------------------------------------------------

app.listen(port);
console.log(`listening on ${port}\n`);
