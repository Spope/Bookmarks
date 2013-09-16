var bootstrap = require('../modules/bootstrap');
var connection = bootstrap.getConnection();

module.exports = function(app) {

    app.get('/', bootstrap.getSecurity().checkAuth, function(req, res){

        res.render('index', {
            user: req.session.user,

            title: 'Bookmarks - '+req.session.user.login
        });

    });


}
