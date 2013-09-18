var bootstrap = require('../../modules/bootstrap');

module.exports = function(app) {

    app.post('/api/login', function(req, res){
        var post = req.body;
        if(( post.login && post.password) || req.cookies.token){
            bootstrap.getSecurity().login(req, res, function(result){
                
                if(result){
                    //Loging the user
                    req.session.user_id = result.id;
                    req.session.user = result;

                    if(post.remember) {
                        res.cookie('token', result.token, {
                            expires: new Date(Date.now() + (1000 * 3600 * 24 * 31 * 6))
                        });
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
        delete req.session.user_id;
        res.cookie('token', null, {expires: new Date()});
        console.log(req.cookies);
        console.log(req.session);
        res.send(200);
    });  
}
