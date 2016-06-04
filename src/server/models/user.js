var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator: function(v) {
        return /^[A-Za-z\d$@$!%*?&]{3,}/.test(v);
      },
      message: 'Invalid Username'
    }
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator: function(v) {
        return /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/.test(v);
      },
      message: 'Invalid Email'
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/.test(v);
      },
      message: 'Invalid Password'
    }
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
