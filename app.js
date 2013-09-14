var express = require('express');
var app = express();

var hbs = require('hbs');


app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
   secret: 'Wohathatscoolycool'
}));
//

var login = require('./controller/login')(app);
var bookmark = require('./controller/api/bookmark')(app);

app.listen(1337);
