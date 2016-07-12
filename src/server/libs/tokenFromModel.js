var jwt = require('jsonwebtoken');

module.exports = function tokenFromModel(userModel, includedKeys, app) {
  var user = {};
  includedKeys.forEach(function(key) {
    user[key] = userModel[key]
  });
  return jwt.sign(user, app.get('jwtSecret'), {
    expiresIn: app.get('jwtDuration')
  });
};
