var express = require('express');
var app = express();

var hbs = require('hbs');
var mysql = require('mysql');

var connection = require('./db/connection')(mysql);

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());



var api = require('./router/api')(app, connection);

app.listen(1337);
