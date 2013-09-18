var express = require('express');
var app = express();

var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('../client/public'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'Wohathatscoolycool'
}));


//var login = require('./controller/login')(app);
//var application = require('./controller/application')(app);
//Api
var login    = require('./controller/api/login')(app);
var user     = require('./controller/api/user')(app);
var category = require('./controller/api/category')(app);
var bookmark = require('./controller/api/bookmark')(app);

app.all('/*', function(req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.render('index');
});

app.listen(1337);
