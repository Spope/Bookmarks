var bootstrap = require('./bootstrap');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user.token);
});
passport.deserializeUser(function(token, done) {
    var sql = "SELECT * FROM user WHERE token = "+bootstrap.getConnection().escape(token)+" LIMIT 1";
    bootstrap.getConnection().query(sql, function(err, rows) {
        if(err){done(err)};
        done(null, rows[0]);
    });
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'login',
            passwordField: 'password'
        },
        function(username, password, done){
            var sql = "SELECT * FROM user WHERE username = "+bootstrap.getConnection().escape(username)+" LIMIT 1";
            bootstrap.getConnection().query(sql, function(err, rows) {
                if(err){return done(err);}
                if(!rows[0]){
                    return done(null, false, {message: 'Incorrect username.'});
                }
                var user = rows[0];
                bootstrap.getSecurity().hash(password, user.salt, function(err, hash) {
                    if(err){return done(err);}
                    if(hash == user.password) return done(null, user);
                    done(null, false, {message: 'Incorrect password.'});
                });
            });
        }
    )
);

/**
* BasicStrategy & ClientPasswordStrategy
*
* These strategies are used to authenticate registered OAuth clients. They are
* employed to protect the `token` endpoint, which consumers use to obtain
* access tokens. The OAuth 2.0 specification suggests that clients use the
* HTTP Basic scheme to authenticate. Use of the client password strategy
* allows clients to send the same credentials in the request body (as opposed
* to the `Authorization` header). While this approach is not recommended by
* the specification, in practice it is quite common.
*/
passport.use(new BasicStrategy(
    function(username, password, done) {
        var sql = "SELECT * FROM oauth_client WHERE client_id = "+bootstrap.getConnection().escape(username)+" LIMIT 1";
        bootstrap.getConnection().query(sql, function(err, rows) {
            if (err) { return done(err); }
            if (!rows[0]) { return done(null, false); }
            if (rows[0].client_secret != password) { return done(null, false); }
            return done(null, rows[0]);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(clientId, client_secret, done) {
        var sql = "SELECT * FROM oauth_client WHERE client_id = "+bootstrap.getConnection().escape(username)+" LIMIT 1";
        bootstrap.getConnection().query(sql, function(err, rows) {
            if (err) { return done(err); }
            if (!rows[0]) { return done(null, false); }
            if (rows[0].client_secret != client_secret) { return done(null, false); }
            return done(null, rows[0]);
        });
    }
));



/**
* BearerStrategy
*
* This strategy is used to authenticate users based on an access token (aka a
* bearer token). The user must have previously authorized a client
* application, which is issued an access token to make requests on behalf of
* the authorizing user.
*/
passport.use(new BearerStrategy(
    function(accessToken, done) {
        var sql = "SELECT * FROM oauth_access_token WHERE token = "+bootstrap.getConnection().escape(accessToken)+" LIMIT 1";
        bootstrap.getConnection().query(sql, function(err, rows) {
            if (err) { return done(err); }
            if (!rows[0]) { return done(null, false); }

            var sql = "SELECT * FROM user WHERE id = "+bootstrap.getConnection().escape(rows[0])+" LIMIT 1";
            bootstrap.getConnection().query(sql, function(err, rows) {
                if (err) { return done(err); }
                if (!rows[0]) { return done(null, false); }
                // to keep this example simple, restricted scopes are not implemented,
                // and this is just for illustrative purposes
                var info = { scope: '*' }
                done(null, rows[0], info);
            });
        });
    }
));






module.exports = {
    passport: passport
}

