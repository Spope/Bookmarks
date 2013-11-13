var bootstrap = require('../../modules/bootstrap');
var passport = bootstrap.getPassport();

module.exports = function(app) {

    app.post('/api/login', passport.authenticate('local'), function(req, res){
        delete req.user.password;
        delete req.user.token;
        if(req.body.remember){         //mili  hour   day month 6 months
            req.session.cookie.maxAge = 1000 * 3600 * 24 * 31 * 6;
            //req.session.cookie.expires = new Date(Date.now() + (1000 * 3600 * 24 * 31 * 6));
        }else{
            req.session.cookie.expires = false;
        }

        res.send(req.user);
    });

    app.get('/api/islogged', bootstrap.getSecurity().checkAuth, function(req, res){
        delete req.user.password;
        delete req.user.token;
        res.send(req.user);
    });
    
    app.get('/api/logout', function (req, res) {
        res = logout(req, res);

        res.send(200);
    });


    function logout(req, res) {
        req.logout();

        return res;
    }


    
}
