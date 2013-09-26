var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();

module.exports = function(app) {

    app.get('/api/user/:idUser/searchEngines', bootstrap.getSecurity().checkAuth, function(req, res){

        var sql = 'SELECT search_engine.* FROM search_engine '+
            'LEFT JOIN user_search_engine ON user_search_engine.search_engine_id = search_engine.id '+
            'WHERE user_search_engine.user_id = '+connection.escape(req.session.user_id)+' '+
            'ORDER BY name ASC';
        connection.query(sql, function(err, rows, fields){
            if(err){
                console.log(err);
            }
            return res.json(rows);
        });

    });

/*
    app.get('/api/categories/:idCat/bookmarks/:id', bootstrap.getSecurity().checkAuth, function(req, res){
        if(req.params.id && req.params.id > 0){
            var sql = 'SELECT * FROM bookmark '+
                'WHERE user_id = '+connection.escape(req.session.user_id)+' '+
                'AND id = '+connection.escape(req.params.id)+' '+
                'AND category_id = '+connection.escape(req.params.idCat)+' '+
                'LIMIT 1';

            connection.query(sql, function(err, rows, field){
                    res.json(rows);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });*/
}
