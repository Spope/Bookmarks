var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();

module.exports = function(app) {

    app.get('/api/user/:idUser/searchEngines', bootstrap.getSecurity().checkAuth, function(req, res){

        var sql = 'SELECT search_engine.*, user_search_engine.default FROM search_engine '+
            'LEFT JOIN user_search_engine ON user_search_engine.search_engine_id = search_engine.id '+
            'WHERE user_search_engine.user_id = '+connection.escape(req.user.id)+' '+
            'ORDER BY name ASC';
        connection.query(sql, function(err, rows, fields){
            if(err){
                console.log(err);
            }
            return res.json(rows);
        });

    });

    app.get('/api/searchEngines', bootstrap.getSecurity().checkAuth, function(req, res){

        var sql = 'SELECT search_engine.* FROM search_engine '+
            'ORDER BY name ASC';
        connection.query(sql, function(err, rows, fields){
            if(err){
                console.log(err);
            }
            return res.json(rows);
        });

    });

    app.post('/api/user/:idUser/searchEngines', bootstrap.getSecurity().checkAuth, function(req, res){

        var list = req.body;
        user_id = req.user.id;

        var sql = 'DELETE FROM user_search_engine '+
            'WHERE user_search_engine.user_id = '+connection.escape(req.user.id);
        connection.query(sql, function(err, rows, fields){
            if(err){
                console.log(err);
            }

            var sql = 'INSERT INTO `user_search_engine` (`user_id`, `search_engine_id`, `default`) VALUES ';
            for(var i in list){
                sql += '('+connection.escape(user_id)+', '+connection.escape(list[i].id)+', '+connection.escape(list[i].default)+'), ';
            }
            sql = sql.substr(0, sql.length - 2);

            connection.query(sql, function(err, rows){

                return res.json({});
            });
        });

    });

}
