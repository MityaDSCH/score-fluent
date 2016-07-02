var User = require('../models/user');
var tokenFromModel = require('../libs/tokenFromModel');

module.exports = function(app) {
  return function(req, res) {
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
  };
};
