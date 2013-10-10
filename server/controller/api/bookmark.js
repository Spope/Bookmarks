var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();

module.exports = function(app) {

    app.get('/api/user/:idUser/category/:idCat/bookmarks', bootstrap.getSecurity().checkAuth, function(req, res){

        var sql = 'SELECT * FROM bookmark '+
            'WHERE user_id = '+connection.escape(req.session.user_id)+' '+
            'AND category_id = '+connection.escape(req.params.idCat)+' '+
            'ORDER BY position';
        connection.query(sql, function(err, rows, fields){
            return res.json(rows);
        });

    });


    app.get('/api/user/:idUser/category/:idCat/bookmark/:id', bootstrap.getSecurity().checkAuth, function(req, res){
        if(req.params.id && req.params.id > 0){
            var sql = 'SELECT * FROM bookmark '+
                'WHERE user_id = '+connection.escape(req.session.user_id)+' '+
                'AND id = '+connection.escape(req.params.id)+' '+
                'AND category_id = '+connection.escape(req.params.idCat)+' '+
                'LIMIT 1';

            connection.query(sql, function(err, rows, field){
                res.json(rows[0]);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });

    app.post('/api/user/:idUser/category/:idCat/bookmark', bootstrap.getSecurity().checkAuth, function(req, res) {
        var bookmark = req.body;
        bookmark.user_id = req.session.user_id;
        bookmark.bookmark_type_id = 1;

        var query = connection.query('INSERT INTO bookmark SET ?', bookmark, function(err, rows, field){
            if(err){
                return res.send(err);
            }
            return res.json({id: rows.insertId});
        });

    });

    app.put('/api/user/:idUser/category/:idCat/bookmark', bootstrap.getSecurity().checkAuth, function(req, res) {
        var bookmark = req.body;
        bookmark.user_id = req.session.user_id;
        bookmark.bookmark_type_id = 1;

        var query = connection.query('UPDATE bookmark SET '+
            'name='+connection.escape(bookmark.name)+', '+
            'position='+connection.escape(bookmark.position)+', '+
            'parent='+connection.escape(bookmark.parent)+', '+
            'category_id='+connection.escape(bookmark.category_id)+', '+
            'url='+connection.escape(bookmark.url)+' '+
            'WHERE id='+connection.escape(bookmark.id)+' '+
            'AND user_id='+req.session.user_id, function(err, rows, field){
            if(err){
                return res.send(err);
            }
            return res.json(bookmark);
        });

    });
}
