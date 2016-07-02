var jwt = require('jsonwebtoken');

module.exports = function tokenFromModel(userModel, includedKeys, duration, secret) {
  var user = {};
  includedKeys.forEach(function(key) {
    user[key] = userModel[key]
  });
  return token = jwt.sign(user, secret, {
    expiresIn: duration
  });
};
