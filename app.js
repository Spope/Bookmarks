var express = require('express');
var app = express();

var hbs = require('hbs');
var mysql = require('mysql');

var connection = require('./db/connection')(mysql);

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());

connection.query('SELECT * FROM `bookmarks`', function(err, rows, fields) {
    if (err) throw err;

    console.log('Result : ', rows[0]);
});

var api = require('./router/api')(app);

app.listen(1337);
