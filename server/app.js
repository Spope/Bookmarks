var express = require('express');
var app = express();
var config = require('./config/config');
var bootstrap = require('./modules/bootstrap');
var passport = bootstrap.getPassport();
var oauth2 = require('./modules/oauth2')

var hbs = require('hbs');

app.set('view engine', 'html');
app.set('views', 'server/views');
app.engine('html', hbs.__express);
app.use(express.static('client/public'));
app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(express.cookieSession({secret:'aarezaeza'}));

app.use(bootstrap.getPassport().initialize());
app.use(bootstrap.getPassport().session());

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

//Api
var login        = require('./controller/api/login')(app);
var user         = require('./controller/api/user')(app);
var category     = require('./controller/api/category')(app);
var bookmark     = require('./controller/api/bookmark')(app);
var searchEngine = require('./controller/api/searchEngine')(app);


app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.get('/dialog/authorize/callback', oauth2.callback);
app.post('/oauth/token', oauth2.token);

app.all('/', function(req, res) {

    if(req.user){
        var categoryService = require('./service/CategoryService');

        var request = categoryService.pageLoad(req.user.id);
        request.then(function(bookmarks){

            res.render('index', {
                debugMode: config.debug,
                userId: req.user.id,
                init: JSON.stringify(bookmarks)
            });
        });

    }else{
        // Just send the index.html for other files to support HTML5Mode
        res.render('index', {
            debugMode: config.debug,
            init: null
        });
    }
});



app.listen(config.port);
