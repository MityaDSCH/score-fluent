var User = require('../models/user');
var tokenFromModel = require('../libs/tokenFromModel');

module.exports = function(app) {
  return function(req, res) {
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
            {field: 'Username or Email', message: 'User not found'}
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
  };
};
