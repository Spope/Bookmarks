var bootstrap = require('../modules/bootstrap');

module.exports = function(app) {

    app.get('/login/', function(req, res){
        res.render('login', {title: "Bookmarks - Please login"});
    });

    app.post('/login/', function(req, res){
        var post = req.body;
        if(post.login && post.password){
            bootstrap.getSecurity().login(post.login, post.password, function(result){
                if(!result){
                    //Error on login
                    res.render('login', {
                        title: "Bookmarks - Please login",
                        logError: true
                    }); 
                }else{
                    //result is the user logged
                }
            });
        }else{

            res.render('login', {
                title: "Bookmarks - Please login",
                logError: true
            });
        }
    });

    
    app.get('/logout', function (req, res) {
        delete req.session.user_id;
        res.redirect('/login');
    });  
}
