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


    app.get('/api/user/:idUser/bookmark/:id', bootstrap.getSecurity().checkAuth, function(req, res){
        if(req.params.id && req.params.id > 0){
            var sql = 'SELECT * FROM bookmark '+
                'WHERE user_id = '+connection.escape(req.session.user_id)+' '+
                'AND id = '+connection.escape(req.params.id)+' '+
                'LIMIT 1';

            connection.query(sql, function(err, rows, field){
                res.json(rows[0]);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });

    app.post('/api/user/:idUser/bookmark', bootstrap.getSecurity().checkAuth, function(req, res) {
        var bookmark = req.body;
        bookmark.user_id = req.session.user_id;
        bookmark.bookmark_type_id = 1;

        var query = connection.query('INSERT INTO bookmark SET ?', bookmark, function(err, rows, field){
            if(err){
                return res.send(err);
            }

            var sql = 'SELECT * FROM bookmark '+
                'WHERE user_id = '+connection.escape(req.session.user_id)+' '+
                'AND id = '+connection.escape(rows.insertId)+' '+
                'LIMIT 1';

            connection.query(sql, function(err, rows, field){
                return res.json(rows[0]);
            });
        });

    });

    app.put('/api/user/:idUser/bookmark', bootstrap.getSecurity().checkAuth, function(req, res) {
        var bookmark = req.body;
        bookmark.user_id = req.session.user_id;
        bookmark.bookmark_type_id = 1;

        //retrieving the old datas to compare position and update it properly
        var sql = 'SELECT * FROM bookmark '+
            'WHERE user_id = '+connection.escape(req.session.user_id)+' '+
            'AND id = '+connection.escape(bookmark.id)+' '+
            'LIMIT 1';

        connection.query(sql, function(err, rows, field){

            if(rows[0].position != bookmark.position) {
                var updatePosition;
                if(rows[0].position - bookmark.position < 0 ) {
                    //from 2 to 4
                    updatePosition = 'UPDATE bookmark SET '+
                        'position = position-1 '+
                        'WHERE category_id = '+connection.escape(bookmark.category_id)+' ';
                        if(bookmark.parent != null){
                            updatePosition += 'AND parent = '+connection.escape(bookmark.parent)+' ';
                        } else {
                            updatePosition += 'AND parent IS NULL ';
                        }
                        updatePosition += 'AND position <='+connection.escape(bookmark.position)+' '+
                        'AND position >'+rows[0].position+' '+
                        'AND user_id ='+req.session.user_id;
                } else {
                    //from 4 to 2
                    updatePosition = 'UPDATE bookmark SET '+
                        'position = position+1 '+
                        'WHERE category_id = '+connection.escape(bookmark.category_id)+' ';
                        if(bookmark.parent != null){
                            updatePosition += 'AND parent = '+connection.escape(bookmark.parent)+' ';
                        } else {
                            updatePosition += 'AND parent IS NULL ';
                        }
                        updatePosition += 'AND position >='+parseInt(bookmark.position)+' '+
                        'AND position <'+rows[0].position+' '+
                        'AND user_id ='+req.session.user_id;
                }

                connection.query(updatePosition, function(err, rows, fields) {

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
                        }
                    );
                });

            } else {

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
                    }
                );
            }
        });

        

    });
}
