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

}
