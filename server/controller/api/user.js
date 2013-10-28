var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();
var userService = require('../../service/UserService');

module.exports = function(app) {

    app.get('/api/user/:id', bootstrap.getSecurity().checkAuth, function(req, res){

        var user;
        if(req.params.id && req.params.id == req.session.user_id) {
            var sql = 'SELECT user.id, user.username, user.email, user.roles '+
                'FROM user '+
                'WHERE user.id = '+connection.escape(req.session.user_id)+' ';
                'ORDER BY position';

            connection.query(sql, function(err, rows, fields){

                user = rows[0];
                //
                var sqlSearchEngine = 'SELECT search_engine.id, search_engine.name, search_engine.url, search_engine.logo '+
                    'FROM user_search_engine '+
                    'JOIN search_engine ON user_search_engine.search_engine_id = search_engine.id '+
                    'WHERE user_search_engine.user_id = '+connection.escape(req.session.user_id);

                connection.query(sqlSearchEngine, function(err, rows, fields){

                    user['search_engine'] = rows;
                    return res.json(user);
                });
                
            });
        } else {

            res.send(401);
        }

    });


    app.get('/api/categories/:id', bootstrap.getSecurity().checkAuth, function(req, res){
        if(req.params.id && req.params.id > 0){
            var sql = 'SELECT * FROM category '+
                'WHERE user_id ='+connection.escape(req.session.user_id)+' '+
                'AND id = '+connection.escape(req.params.id)+' '+
                'LIMIT 1';

            connection.query(sql, function(err, rows, field){
                    res.json(rows);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });


    app.post('/api/register', function (req, res) {
        var user = {};
        user.username = req.body.login;
        user.password = req.body.password;
        user.email    = req.body.email;

        userService.register(user).then(function(data) {

            res.send('OK');

        }).catch(function(err) {console.log(err)});
    });
}
