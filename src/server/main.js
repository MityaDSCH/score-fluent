// Import dependencies
var express = require('express');
var path = require('path');
var compression = require('compression');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

if (process.env.NODE_ENV != 'production') {
   require('dotenv').config();
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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Log requests middleware
app.use(morgan('dev'));

// Serve client
app.use(express.static(path.join(__dirname, '../client')));
app.get('/', express.static('./dist/client'));
app.get('*', (req, res) => res.redirect('/'));

// Serve api routes
require('./routes.js')(app);

app.listen(port);
console.log(`listening on ${port}\n`);
