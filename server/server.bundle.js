/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Import dependencies
	var express = __webpack_require__(1);
	var path = __webpack_require__(2);
	var compression = __webpack_require__(3);
	var bodyParser = __webpack_require__(4);
	var morgan = __webpack_require__(5);
	var mongoose = __webpack_require__(6);

	if (process.env.NODE_ENV != 'production') {
	   __webpack_require__(7).config();
	}

	var port = process.env.PORT || 9000;

	var app = express();

	// Constants
	// time in this format: https://github.com/rauchg/ms.js
	app.set('jwtSecret', process.env.JWT_SECRET);
	app.set('jwtDuration', '1 year');

	// connect to mongodb
	mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/score-fluent');

	// Parse json and url-encodec middleware
	app.use(compression());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	// Log requests middleware
	app.use(morgan('dev'));

	// Serve client
	app.use(express.static(path.join(__dirname, '../client')));
	app.get('/', express.static('./dist/client'));
	app.get('*', function (req, res) {
	   return res.redirect('/');
	});

	// Serve api routes
	__webpack_require__(8)(app);

	app.listen(port);
	console.log('listening on ' + port + '\n');

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("dotenv");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Import dependencies
	var passport = __webpack_require__(9);
	var express = __webpack_require__(1);

	// Load routes
	var registerRoute = __webpack_require__(10);
	var authenticateRoute = __webpack_require__(15);
	var timedScoreRoute = __webpack_require__(16);

	// Load libs
	var tokenFromModel = __webpack_require__(13);

	// Export Routes
	module.exports = function (app) {

	  // Init Passport middleware
	  app.use(passport.initialize());

	  // Use passport jwt Strategy
	  __webpack_require__(19)(passport);

	  var apiRoutes = express.Router();

	  // Enable cors
	  if (process.env.NODE_ENV !== 'production') {
	    apiRoutes.use(function (req, res, next) {
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
	  apiRoutes.post('/timed-score', passport.authenticate('jwt', { session: false }), timedScoreRoute(app));

	  app.use('/api', apiRoutes);
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var User = __webpack_require__(11);
	var tokenFromModel = __webpack_require__(13);

	module.exports = function (app) {
	  return function (req, res) {
	    if (!req.body.email || !req.body.password || !req.body.username) {
	      res.json({ success: false, message: 'Fill out all required fields' });
	    } else {
	      var newUser = new User({
	        username: req.body.username,
	        email: req.body.email,
	        password: req.body.password
	      });
	      newUser.save(function (err) {
	        if (err) {
	          if (err.code == 11000) {
	            // Catch mongoose duplicate errors
	            var errmsg = err.toJSON().errmsg;
	            var duplicate = errmsg.slice(errmsg.indexOf('$') + 1, errmsg.indexOf('_'));
	            return res.json({
	              success: false,
	              invalidFields: [{ field: duplicate, message: 'Duplicate ' + duplicate }]
	            });
	          } else if (err.name == 'ValidationError') {
	            // Catch mongoose validation errors
	            var errors = Object.keys(err.errors);
	            errors = errors.map(function (errName) {
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
	              invalidFields: [{ field: null, message: 'Unknown error' }]
	            });
	          }
	        }
	        var token = tokenFromModel(newUser, ['_id', 'username', 'email', 'role'], app);
	        res.json({ success: true, message: 'New user added', token: 'JWT ' + token });
	      });
	    }
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var mongoose = __webpack_require__(6);
	var bcrypt = __webpack_require__(12);

	var UserSchema = new mongoose.Schema({
	  username: {
	    type: String,
	    lowercase: true,
	    unique: true,
	    required: true,
	    validate: {
	      validator: function validator(v) {
	        return (/^[A-Za-z\d$@$!%*?&]{3,}/.test(v)
	        );
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
	      validator: function validator(v) {
	        return (/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/.test(v)
	        );
	      },
	      message: 'Invalid Email'
	    }
	  },
	  password: {
	    type: String,
	    required: true,
	    validate: {
	      validator: function validator(v) {
	        return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/.test(v)
	        );
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

	UserSchema.pre('save', function (next) {
	  var user = this;
	  if (this.isModified('password') || this.isNew) {
	    bcrypt.genSalt(10, function (err, salt) {
	      if (err) {
	        return next(err);
	      }
	      bcrypt.hash(user.password, salt, function (err, hash) {
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

	UserSchema.methods.comparePassword = function (pw, cb) {
	  bcrypt.compare(pw, this.password, function (err, isMatch) {
	    if (err) {
	      return cb(err);
	    }
	    cb(null, isMatch);
	  });
	};

	module.exports = mongoose.model('User', UserSchema);

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("bcrypt");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var jwt = __webpack_require__(14);

	module.exports = function tokenFromModel(userModel, includedKeys, app) {
	  var user = {};
	  includedKeys.forEach(function (key) {
	    user[key] = userModel[key];
	  });
	  return jwt.sign(user, app.get('jwtSecret'), {
	    expiresIn: app.get('jwtDuration')
	  });
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var User = __webpack_require__(11);
	var tokenFromModel = __webpack_require__(13);

	module.exports = function (app) {
	  return function (req, res) {
	    User.findOne({
	      $or: [{ email: req.body.id }, { username: req.body.id }]
	    }, function (err, user) {
	      if (err) {
	        console.log(err);
	        throw err;
	      }
	      if (!user) {
	        res.send({
	          success: false,
	          invalidFields: [{ field: 'Username or Email', message: 'User not found' }]
	        });
	      } else {
	        user.comparePassword(req.body.password, function (err, isMatch) {
	          if (isMatch && !err) {
	            var token = tokenFromModel(user, ['_id', 'username', 'email', 'role'], app);
	            res.json({ success: true, token: 'JWT ' + token });
	          } else {
	            res.send({
	              success: false,
	              invalidFields: [{ field: 'password', message: 'Password did not match' }]
	            });
	          }
	        });
	      }
	    });
	  };
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(17);

	var Leaderboard = __webpack_require__(18);

	// req has form {_id (for user), difficulty, clefs, score}

	module.exports = function (app) {
	  return function (req, res) {

	    var leaderboardBody = {
	      difficulty: req.body.difficulty,
	      clefs: typeof req.body.clefs === 'string' ? JSON.parse(req.body.clefs) : req.body.clefs
	    };

	    var newEntry = {
	      user: req.body._id,
	      score: req.body.score
	    };

	    // find/create relevant leaderboard and update/create entry
	    Leaderboard.findOne(leaderboardBody, function (err, leaderboard) {

	      if (leaderboard === null) {
	        leaderboard = new Leaderboard(leaderboardBody);
	      }

	      var curEntries = leaderboard.entries.toObject();

	      var curUserEntryIndex = _.findIndex(leaderboard.entries, function (entry) {
	        return String(entry.user) == newEntry.user;
	      });

	      var highScore;
	      if (leaderboard.entries[curUserEntryIndex]) {
	        highScore = leaderboard.entries[curUserEntryIndex].score;
	      } else {
	        highScore = -Infinity;
	      }

	      if (curUserEntryIndex === -1) {
	        leaderboard.entries = binaryInsertEntry(leaderboard.entries, newEntry);
	      } else {
	        var curEntry = leaderboard.entries[curUserEntryIndex];
	        if (req.body.score > curEntry.score) {
	          leaderboard.entries.splice(curUserEntryIndex, 1);
	          leaderboard.entries = binaryInsertEntry(leaderboard.entries, newEntry);
	        }
	      }

	      leaderboard.save(function (err) {
	        if (err) res.json({ success: false, err: err });else {
	          //Find the top 5 scores and return to client in form {success, [{username, score}]}
	          Leaderboard.findOne(leaderboardBody).slice('entries', 5).populate({
	            path: 'entries.user',
	            select: 'username'
	          }).exec(function (err, leaderboard) {
	            if (err) res.json({ success: false, err: err });
	            res.json({
	              success: true,
	              highScore: Math.max(highScore, newEntry.score),
	              topScores: leaderboard.entries.map(function (entry) {
	                return {
	                  username: entry.user.username,
	                  score: entry.score
	                };
	              })
	            });
	          });
	        }
	      });
	    });
	  };
	};

	function binaryInsertEntry(lbEntries, newEntry) {
	  // use binary search to find the proper index sort by increasing negative score
	  var binaryInsertIndex = _.sortedIndexBy(lbEntries, newEntry, function (entry) {
	    return -entry.score;
	  });

	  lbEntries.splice(binaryInsertIndex, 0, newEntry);

	  return lbEntries;
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var mongoose = __webpack_require__(6);

	var LeaderboardEntrySchema = new mongoose.Schema({
	  user: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'User',
	    required: true
	  },
	  score: {
	    type: Number,
	    required: true
	  }
	});

	var LeaderboardSchema = new mongoose.Schema({
	  difficulty: {
	    type: String,
	    required: true
	  },
	  clefs: {
	    type: Array,
	    required: true
	  },
	  entries: [LeaderboardEntrySchema]
	});

	module.exports = mongoose.model('Leaderboard', LeaderboardSchema);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var JwtStrategy = __webpack_require__(20).Strategy;
	var ExtractJwt = __webpack_require__(20).ExtractJwt;
	var User = __webpack_require__(11);

	module.exports = function (passport) {
	  var opts = {};
	  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	  opts.secretOrKey = process.env.JWT_SECRET;
	  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
	    User.findOne({ id: jwt_payload.id }, function (err, user) {
	      if (err) {
	        return done(err, false);
	      }
	      if (user) {
	        done(null, user);
	      } else {
	        done(null, false);
	      }
	    });
	  }));
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("passport-jwt");

/***/ }
/******/ ]);