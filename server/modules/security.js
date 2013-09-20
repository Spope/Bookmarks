var bootstrap = require('./bootstrap');
var crypto = require('crypto');
var connection = bootstrap.getConnection();

module.exports = {

    checkAuth: function(req, res, next){
        if (!req.session.user_id) {

            if(req.cookies.token){
                bootstrap.getSecurity().login(req, res, function(result){
                    if(result){
                        //Loging the user
                        req.session.user_id = result.id;
                        req.session.user = result;
                        next();
                    }else{
                        res.send(401);
                    }
                });
            }else{

                res.send(401);
            }
        } else {
            next();
        }
    },

    login: function(req, res, callback) {

        if(req.body.login && req.body.login) {
            var login = req.body.login;
            var password = req.body.password;
            var remember = req.body.remember;

            connection.query('SELECT * FROM user WHERE username = '+connection.escape(login)+' LIMIT 1', function(err, rows, fields){
                if(rows.length == 0) {
                    var result = false;
                    callback.call(null, false);
                }else{

                    validatePassword(password, rows[0].password, function(result){
                        if(result){
                            //Loging the user
                            req.session.user_id = result.id;
                            req.session.user = result;
                            //
                            callback.call(null, rows[0]);
                        }else{
                            callback.call(null, false);
                        }
                    })

                }
            })
        }else if(req.cookies.token) {
            connection.query('SELECT * FROM user WHERE token = '+connection.escape(req.cookies.token)+' LIMIT 1', function(err, rows, fields){
                if(rows.length == 0) {
                    var result = false;
                    callback.call(null, false);
                }else{

                    callback.call(null, rows[0]);
                }
            })
        }

    }
}





var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}


var validatePassword = function(plainPass, hashedPass, callback) {
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback.call(null, hashedPass === validHash);
}


var generateSalt = function() {
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}


var saltAndHash = function(pass, callback) {
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}
