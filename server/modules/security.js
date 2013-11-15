var bootstrap = require('./bootstrap');
var crypto = require('crypto');
var connection = bootstrap.getConnection();
var moment = require('moment');
var searchEngineService = require('../service/SearchEngineService');
var Validator = require('validator').Validator;

var len = 128;
var iterations = 12000;
module.exports = {

    checkAuth: function(req, res, next){
        if (req.isAuthenticated()) {
            next();
        } else {
            res.send(401);
        }
    },

    /**
    * Hashes a password with optional `salt`, otherwise
    * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
    *
    * @param {String} password to hash
    * @param {String} optional salt
    * @param {Function} callback
    * @api public
    */
    hash: function (pwd, salt, fn) {
        if (3 == arguments.length) {
            crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
                fn(err, (new Buffer(hash, 'binary')).toString('base64'));
            });
        } else {
            fn = salt;
            crypto.randomBytes(len, function(err, salt){
                if (err) return fn(err);
                salt = salt.toString('base64');
                crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
                    if (err) return fn(err);
                    fn(null, salt, (new Buffer(hash, 'binary')).toString('base64'));
                });
            });
        }
    }
}
