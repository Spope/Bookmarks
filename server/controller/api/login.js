var bootstrap = require('../../modules/bootstrap');

module.exports = function(app) {

    app.post('/api/login', function(req, res){
        var post = req.body;
        //If I the user has a cookie i remove it except if it's an autolog request (a page re-load for example)
        if(!post.autolog) {
            res = logout(req, res);
        }
        if(( post.login && post.password) || req.cookies.token || req.session.user_id){

            bootstrap.getSecurity().login(req, res, function(result){

                if(result){
                    //Loging the user
                    req.session.user_id = result.id;
                    req.session.user = result;

                    if(post.remember) {
                        res.cookie(
                            'token',
                            {
                                id: result.token,
                                remember: true
                            },
                            {                                  //mili  hour   day month 6 months
                                expires: new Date(Date.now() + (1000 * 3600 * 24 * 31 * 6))
                            }
                        );
                    } else if(!req.cookies.token || (req.cookies && !req.cookies.token.remember)) {
                        //Add a cookie to retrieve session. cookie will die with the session
                        res.cookie('token', {id: result.token, remember: false});
                    }
                    res.send(result);

                }else{
                    //Error on login
                    res.send(401, JSON.stringify({error: true}));
                }
            });
        }else{

            res.send(401, JSON.stringify({error: true}));
        }
    });
    
    app.get('/api/logout', function (req, res) {
        res = logout(req, res);

        res.send(200);
    });


    function logout(req, res) {
        delete req.session.user_id;
        delete req.session.user;

        res.clearCookie('token');

        return res;
    }


    
}
