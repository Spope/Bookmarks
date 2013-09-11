var express = require('express');
var app = express();

var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());

var api = require('./api')(app);

app.listen(1337);
