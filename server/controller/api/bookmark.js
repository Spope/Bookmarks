var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();
var Q = bootstrap.getPromise();

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

            __updateCategory(bookmark, rows[0])
            //.then(function(bookmark) {
                //return __updatePosition(bookmark, rows[0]);
            //})
            .then(function(bookmark) {
                return __updateBookmark(bookmark, rows[0]);
            })
            .then(function(bookmark) {

                return res.json(bookmark);
            });
        });



        var __updateCategory = function(bookmark, oldBookmark) {

            var deferred = Q.defer();

            if(bookmark.category_id != oldBookmark.category_id) {

                var getCount = "SELECT COUNT(id) AS count FROM bookmark WHERE category_id = "+parseInt(bookmark.category_id);
                connection.query(getCount, function(err, rows, fields) {

                    var tempPosition = rows[0].count;

                    var updateCategory;
                    updateCategory = 'UPDATE bookmark SET '+
                        'position = '+tempPosition+', '+
                        'category_id = '+connection.escape(bookmark.category_id)+' '+
                        'WHERE id = '+connection.escape(bookmark.id)+' '+
                        'AND user_id ='+req.session.user_id;

                    connection.query(updateCategory, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            deferred.reject(err);
                        }

                        console.log('__updateCategory');

                        //Update of the old categroy. Each bookmark after the removed on are deincremented
                        var updateOldPosition = "";
                        updateOldPosition = 'UPDATE bookmark SET '+
                            'position = position-1 '+
                            'WHERE category_id = '+connection.escape(oldBookmark.category_id)+' ';
                            if(bookmark.parent != null){
                                updateOldPosition += 'AND parent = '+connection.escape(bookmark.parent)+' ';
                            } else {
                                updateOldPosition += 'AND parent is NULL ';
                            }
                            updateOldPosition += 'AND position >='+connection.escape(oldBookmark.position)+' '+
                            'AND user_id ='+req.session.user_id;

                            console.log(updateOldPosition);

                        connection.query(updateOldPosition, function(err, rows, fields) {
                            if(err){
                                console.log(err);
                                deferred.reject(err);
                            }
                        

                            if(tempPosition != bookmark.position) {
                                oldBookmark.position = tempPosition;
                                deferred.resolve(__updatePosition(bookmark, oldBookmark));
                            } else {
                                deferred.resolve(bookmark);
                            }
                        });
                    });
                });
            } else {

                deferred.resolve(bookmark);
            }

            return deferred.promise;

        }

        var __updatePosition = function(bookmark, oldBookmark) {
            var deferred = Q.defer();
            var oldposition = oldBookmark.position;
            if(bookmark.position != oldposition) {
                var updateposition;
                if(oldposition - bookmark.position < 0 ) {
                    //from 2 to 4
                    updateposition = 'update bookmark set '+
                        'position = position-1 '+
                        'where category_id = '+connection.escape(bookmark.category_id)+' ';
                        if(bookmark.parent != null){
                            updateposition += 'and parent = '+connection.escape(bookmark.parent)+' ';
                        } else {
                            updateposition += 'and parent is null ';
                        }
                        updateposition += 'and position <='+connection.escape(bookmark.position)+' '+
                        'and position >'+oldposition+' '+
                        'and user_id ='+req.session.user_id;
                } else {
                    //from 4 to 2
                    updateposition = 'update bookmark set '+
                        'position = position+1 '+
                        'where category_id = '+connection.escape(bookmark.category_id)+' ';
                        if(bookmark.parent != null){
                            updateposition += 'and parent = '+connection.escape(bookmark.parent)+' ';
                        } else {
                            updateposition += 'and parent is null ';
                        }
                        updateposition += 'and position >='+parseInt(bookmark.position)+' '+
                        'and position <'+oldposition+' '+
                        'and user_id ='+req.session.user_id;
                }

                connection.query(updateposition, function(err, rows, fields) {
                    console.log('__updatePosition');
                    if(err){
                        console.log(err);
                        deferred.reject(err);
                    }
                    connection.query("UPDATE bookmark SET position="+parseInt(bookmark.position)+" "+
                            'WHERE category_id = '+connection.escape(bookmark.category_id)+' '+
                            'AND id = '+parseInt(bookmark.id)+' '+
                            'AND user_id ='+req.session.user_id, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            deferred.reject(err);
                        }

                        deferred.resolve(bookmark);
                    });
                    
                });
            } else {
                deferred.resolve(bookmark);
            }

            return deferred.promise;
        }

        

        var __updateBookmark = function(bookmark, oldBookmark) {

            var deferred = Q.defer();

            var query = connection.query('UPDATE bookmark SET '+
                'name='+connection.escape(bookmark.name)+', '+
                //'position='+connection.escape(bookmark.position)+', '+
                'parent='+connection.escape(bookmark.parent)+', '+
                //'category_id='+connection.escape(bookmark.category_id)+', '+
                'url='+connection.escape(bookmark.url)+' '+
                'WHERE id='+connection.escape(bookmark.id)+' '+
                'AND user_id='+req.session.user_id, function(err, rows, field){
                    if(err){
                        deferred.reject(err);
                    }

                    console.log('__updateBookmark');

                    deferred.resolve(bookmark);
                }
            );

            return deferred.promise;
        }

    });

    
}
