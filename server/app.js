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
var oneDay = 1000 * ( 60 * 60 * 24 * 365 );
app.use(express.static('client/public', { maxAge: oneDay }));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.compress());

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

app.get('/', function(req, res) {

    if(req.user){
        var categoryService = require('./service/CategoryService');
        var searchEngineService = require('./service/SearchEngineService');
        var bookmarks = {};
        var searchEngines = {};
        var count = 0;

        var pageLoad = categoryService.pageLoad(req.user.id);
        pageLoad.then(function(b){
            bookmarks = b;
            count++;
            sendResponse();
        });
        var searchEnginesRequest = searchEngineService.getUserSearchEngines(req.user.id);
        searchEnginesRequest.then(function(s){
            searchEngines = s;
            count++;
            sendResponse();
        });

        var sendResponse = function(){
            if(count == 2){
                delete req.user.password;
                delete req.user.token;
                delete req.user.salt;
                delete req.user.created;
                delete req.user.updated;

                res.render('index', {
                    debugMode: config.debug,
                    userId: req.user.id,
                    init: JSON.stringify(bookmarks),
                    searchEngines: JSON.stringify(searchEngines),
                    user: JSON.stringify(req.user)
                });
            }
        }

    }else{
        // Just send the index.html for other files to support HTML5Mode
        res.render('index', {
            debugMode: config.debug,
            init: null
        });
    }
});



app.listen(config.port);
