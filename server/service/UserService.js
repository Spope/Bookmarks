var bootstrap = require('../modules/bootstrap');
var connection = bootstrap.getConnection();
var Q = bootstrap.getPromise();
var moment = require('moment');
var searchEngineService = require('../service/SearchEngineService');
var categoryService = require('../service/CategoryService');
var Validator = require('validator').Validator;

module.exports = {

    register: function(user) {

        var defer = Q.defer();

        user.password = bootstrap.getSecurity().saltAndHash(user.password);
        user.created  = moment().format('YYYY-MM-DD HH:mm:ss');
        user.token    = bootstrap.getSecurity().md5(bootstrap.getSecurity().generateSalt(32));
        user.roles    = 1;

        var validator = new Validator();

        validator.error = function(msg) {
            console.log(msg);
        }
        validator.check(user.email).isEmail();
        validator.check(user.username).is(/^[A-z][A-z0-9]*$/);
        validator.check(user.username).len(3, 30);

        if(validator._errors && validator._errors.length > 0) {
            defer.reject(new Error("input error"));
        }

        var exec = __insertUser(user);

        exec.then(function(data) {
            //Insertion of search Engine links
            return searchEngineService.initUser(data.insertId);
        }).then(function(data) {

            var defaultCategory = {
                name : "__default",
                user_id : data
            };

            return categoryService.addCategory(defaultCategory);

        }).then(function(data) {

            defer.resolve(200);
        }).catch(function(err) {console.log(err)});

        return defer.promise;
    },
}

var __insertUser = function(user) {

    var defer = Q.defer();

    var query = "INSERT INTO user SET ?";
    connection.query(query, user, function(err, rows, fields) {
        if(err){
            console.log(err);
            defer.reject(err);
        }

        defer.resolve(rows);
    });

    return defer.promise;
}
