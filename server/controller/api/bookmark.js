var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();
var Q = bootstrap.getPromise();

module.exports = function(app) {

    app.get('/api/user/:idUser/category/:idCat/bookmarks', bootstrap.getSecurity().checkAuth, function(req, res){

        var sql = 'SELECT * FROM bookmark '+
            'WHERE user_id = '+connection.escape(req.session.user_id)+' '+
            'AND category_id = '+connection.escape(req.params.idCat)+' '+
            'AND parent IS NULL '+
            'ORDER BY position';
        connection.query(sql, function(err, rows, fields){
            return res.json(rows);
        });

    });

    app.get('/api/user/:idUser/category/:idCat/parent/:idparent', bootstrap.getSecurity().checkAuth, function(req, res){
        if(req.params.idparent && req.params.idparent > 0){
            var sql = 'SELECT * FROM bookmark '+
                'WHERE user_id = '+connection.escape(req.session.user_id)+' '+
                'AND category_id = '+connection.escape(req.params.idCat)+' '+
                'AND parent = '+parseInt(req.params.idparent)+' '+
                'ORDER BY position';
            connection.query(sql, function(err, rows, fields){
                return res.json(rows);
            });
        }

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

        var getOldBook = Q.defer();

        connection.query(sql, function(err, rows, field){
            if(err){
                console.log(err);
                getOldBook.reject(err);
            }

            getOldBook.resolve(rows[0]);
        });

        getOldBook.promise.then(function(oldBookmark) {
            var exec = null;
            if(bookmark.category_id == oldBookmark.category_id) {
                exec = __updatePosition(bookmark, oldBookmark);
            }else{
                exec = __updateCategory(bookmark, oldBookmark);
            }
            
            exec.then(function(bookmark) {
                return __updateBookmark(bookmark, oldBookmark);
            })
            .then(function(bookmark) {

                return res.json(bookmark);
            });
        });

        /**
         * If the bookmark has changed of category
         */
        var __updateCategory = function(bookmark, oldBookmark) {

            var returnPromise = Q.defer();

            if(bookmark.category_id != oldBookmark.category_id) {

                //I retrieve the total of bookmark into the new category
                var getCount = "SELECT COUNT(id) AS count FROM bookmark WHERE category_id = "+parseInt(bookmark.category_id);
                var getCountPromise = Q.defer();
                connection.query(getCount, function(err, rows, fields) {
                    if(err){
                        console.log(err);
                        returnPromise.reject(err);
                    }

                    getCountPromise.resolve(rows[0].count);
                });

                var updateBookPromise = Q.defer();
                var tempPosition;
                getCountPromise.promise.then(function(count) {
                    tempPosition = count;
                    //I temporary set the bookmark as the last of the new category
                    var updateCategory = 'UPDATE bookmark SET '+
                        'position = '+tempPosition+', '+
                        'category_id = '+connection.escape(bookmark.category_id)+' '+
                        'WHERE id = '+connection.escape(bookmark.id)+' '+
                        'AND user_id ='+req.session.user_id;

                    connection.query(updateCategory, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            returnPromise.reject(err);
                        }

                        updateBookPromise.resolve(rows[0]);
                    });
                });

                var updateOldCategoryPromise = Q.defer();
                updateBookPromise.promise.then(function(update) {
                    //Update of the old categroy. Each bookmark after the removed on are de-incremented
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

                    connection.query(updateOldPosition, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            returnPromise.reject(err);
                        }

                        updateOldCategoryPromise.resolve(rows[0])
                    });
                });

                updateOldCategoryPromise.promise.then(function(update) {

                    //The bookmarks has been temporary placed as the last one of the category. If it's not
                    //his position, I use the __updatePosition function to place him.
                    if(tempPosition != bookmark.position) {
                        oldBookmark.position = tempPosition;
                        returnPromise.resolve(__updatePosition(bookmark, oldBookmark));
                    } else {
                        returnPromise.resolve(bookmark);
                    }
                });

            } else {

                returnPromise.resolve(bookmark);
            }

            return returnPromise.promise;
        }

        var __updatePosition = function(bookmark, oldBookmark) {
            var deferred = Q.defer();
            var oldposition = oldBookmark.position;
            if(bookmark.position != oldposition) {
                //Building the request that will update other bookmarks from the category
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
                var updateBookmarksPromise = Q.defer();
                connection.query(updateposition, function(err, rows, fields) {
                    if(err){
                        console.log(err);
                        deferred.reject(err);
                    }
                    
                    updateBookmarksPromise.resolve(rows[0]);
                });

                updateBookmarksPromise.promise.then(function(update) {
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

            connection.query('UPDATE bookmark SET '+
                'name='+connection.escape(bookmark.name)+', '+
                'parent='+connection.escape(bookmark.parent)+', '+
                'url='+connection.escape(bookmark.url)+' '+
                'WHERE id='+connection.escape(bookmark.id)+' '+
                'AND user_id='+req.session.user_id, function(err, rows, field){
                    if(err){
                        deferred.reject(err);
                    }

                    deferred.resolve(bookmark);
                }
            );

            return deferred.promise;
        }

    });

    
}
