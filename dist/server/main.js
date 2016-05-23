var express = require('express');

var app = express();

app.use('/', express.static('./dist/client'));

var port = process.env.PORT || 9000;
app.listen(port);

console.log(`listening on ${port}\n`);
