var dotenv = require('dotenv').config();
var express =require('express');

var app = express();

app.use('/', express.static('./dist/client'));


if (process.env.NODE_ENV == 'development') {
  app.listen(process.env.SERVER_PORT);
} else {
  app.listen(process.env.PORT);
}

console.log(`listening on ${process.env.SERVER_PORT}\n`);
