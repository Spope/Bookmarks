var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();
var searchEngineService = require('../../service/SearchEngineService');

module.exports = function(app) {

    app.get('/api/user/:idUser/searchEngines', bootstrap.getSecurity().checkAuth, function(req, res){

        searchEngineService.getUserSearchEngines(req.user.id).then(function(searchEngines){
            res.json(searchEngines);
        });

    });

    app.get('/api/searchEngines', bootstrap.getSecurity().checkAuth, function(req, res){

        searchEngineService.getSearchEngines().then(function(searchEngines){
            res.json(searchEngines);
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
