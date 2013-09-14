var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();

module.exports = function(app) {
    app.get('/api/', function(req, res){
        res.json({});
    });


    app.get('/api/bookmarks/', bootstrap.getSecurity().checkAuth, function(req, res){

        var sql = 'SELECT * FROM bookmark '+
            'WHERE user_id = '+connection.escape(req.session.user_id)+' ';
            'ORDER BY position';
        connection.query(sql, function(err, rows, fields){
            return res.json(rows);
        });

    });



    app.get('/api/bookmarks/:id', function(req, res){
        if(req.params.id && req.params.id > 0){
            var sql = 'SELECT * FROM bookmark '+
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
}
