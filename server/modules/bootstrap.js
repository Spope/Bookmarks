var config = require('../config/config');

module.exports = {
    getMysql: function(){
        if(!this.mysql){
            this.mysql = require('mysql');
        }

        return this.mysql;
    },

    getConnection: function(test){
        if(!this.connection){
            this.connection = require('../db/connection')(this.getMysql(), config.db, test);
        }

        return this.connection;
    },

    getDbEngine: function(){
        if(!this.dbEngine){
            this.dbEngine = require('../db/engine')(this.getConnection());
        }

        return this.dbEngine;

    },

    getSecurity: function(){
        if(!this.securiy){
            this.security = require('./security');
        }

        return this.security;

    },

    getPromise: function(){
        if(!this.promise){
            this.promise = require('q');
        }

        return this.promise;
    },

    getPassport: function() {
        if(!this.passport){
            var that = this;
            this.passport = require('passport');

            this.passport.serializeUser(function(user, done) {
                done(null, user.token);
            });
            this.passport.deserializeUser(function(token, done) {
                var sql = "SELECT * FROM user WHERE token = "+that.getConnection().escape(token)+" LIMIT 1";
                that.getConnection().query(sql, function(err, rows) {
                    if(err){done(err)};
                    done(null, rows[0]);
                });
            });

            this.passport.use(
                this.getLocalStrategy()
            );
        }

        return this.passport;
    },

    getLocalStrategy: function() {
        if(!this.localStrategy) {
            var LocalStrategyConstructor = require('passport-local').Strategy;
            var that = this;
            this.localStrategy = new LocalStrategyConstructor(
                {
                    usernameField: 'login',
                    passwordField: 'password'
                },
                function(username, password, done){
                    var sql = "SELECT * FROM user WHERE username = "+that.getConnection().escape(username)+" LIMIT 1";
                    that.getConnection().query(sql, function(err, rows) {
                        if(err){return done(err);}
                        if(!rows[0]){
                            return done(null, false, {message: 'Incorrect username.'});
                        }
                        var user = rows[0];
                        that.getSecurity().hash(password, user.salt, function(err, hash) {
                            if(err){return done(err);}
                            if(hash == user.password) return done(null, user);
                            done(null, false, {message: 'Incorrect password.'});
                        });
                    });
                }
            );
        }

        return this.localStrategy;
    }
}
