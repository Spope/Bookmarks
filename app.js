var express = require('express');
var app = express();

var hbs = require('hbs');
var mysql = require('mysql');

var connection = require('./db/connection')(mysql);
//The module that request the DB
var dbEngine = {};
require('./db/engine')(connection, dbEngine);

var checkAuth = function(req, res, next){
    if (!req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        next();
    }
}

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
   secret: 'Wohathatscoolycool'
}));


var api = require('./controller/api')(app, dbEngine, checkAuth);

app.listen(1337);
