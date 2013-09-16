var express = require('express');
var app = express();

var hbs = require('hbs');

app.use("/static", express.compress());
app.use("/static", express.static("../client/public"));
app.use("/static", function(req, res, next) {
    res.send(404); // If we get here then the request for a static file is invalid
  });

app.set('view engine', 'html');
app.engine('html', hbs.__express);
//app.use(express.static('../client/public'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
   secret: 'Wohathatscoolycool'
}));


//

//var login = require('./controller/login')(app);
//var application = require('./controller/application')(app);
//Api
var category = require('./controller/api/category')(app);
var bookmark = require('./controller/api/bookmark')(app);


app.all('/*', function(req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendfile('index.html', {root: '../client'});
});

app.listen(1337);
