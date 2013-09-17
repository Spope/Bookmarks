var bootstrap = require('../../modules/bootstrap');

module.exports = function(app) {

    app.post('/api/login', function(req, res){
        var post = req.body;
        if(post.login && post.password){
            bootstrap.getSecurity().login(post.login, post.password, function(result){
                
                if(result){
                    //
                    req.session.user_id = result.id;
                    req.session.user = result;
                    if(post.remember) {
                        req.session.cookie.maxAge = 1000 * 3600 * 24 * 31 * 6;//6 mois
                    }
                    res.send(post);
                     

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
        res.redirect('/login');
    });  
}
