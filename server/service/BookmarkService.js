var bootstrap = require('../modules/bootstrap');
var connection = bootstrap.getConnection();
var Q = bootstrap.getPromise();

module.exports = {

    that: this,

    getBookmarks: function(idUser, idCategory, idParent) {

        var defer = Q.defer();

        var parentValue = 'IS NULL';
        if(idParent) {
            parentValue = '= '+parseInt(idParent);
        }

        var sql = 'SELECT * FROM bookmark '+
            'WHERE user_id = '+connection.escape(idUser)+' '+
            'AND category_id = '+connection.escape(idCategory)+' '+
            'AND parent '+parentValue+' '+
            'ORDER BY position';

        connection.query(sql, function(err, rows, fields){
            if(err){
                defer.reject(err);
            }
            defer.resolve(rows);
        });

        return defer.promise;
    },

    getBookmark: function(idUser, idBookmark) {
        var defer = Q.defer();

        var sql = 'SELECT * FROM bookmark '+
            'WHERE user_id = '+connection.escape(idUser)+' '+
            'AND id = '+connection.escape(idBookmark)+' '+
            'LIMIT 1';

        connection.query(sql, function(err, rows, field){
            if(err){
                deferred.reject(err);
            }
            defer.resolve(rows[0]);
        });

        return defer.promise;
    },






    addBookmark: function(bookmark) {
        var defer = Q.defer();

        connection.query('INSERT INTO bookmark SET ?', bookmark, function(err, rows, field){
            if(err){
                console.log(err);
                defer.reject(err);
            }

            var sql = 'SELECT * FROM bookmark '+
                'WHERE user_id = '+connection.escape(bookmark.user_id)+' '+
                'AND id = '+connection.escape(rows.insertId)+' '+
                'LIMIT 1';

            connection.query(sql, function(err, rows, field){
                if(err){
                    defer.reject(err);
                }

                defer.resolve(rows[0]);
            });
        });

        return defer.promise;
    },

    deleteBookmark: function(idUser, bookmark) {
        var defer = Q.defer();

        //Removing every children bookmarks / folder
        this.__recursiveDelete(idUser, bookmark).then(function(data) {
            //removing the bookmark / folder
            connection.query('DELETE FROM bookmark WHERE '+
                    'id = '+parseInt(bookmark.id)+' '+
                    'AND user_id = '+parseInt(idUser)+' '+
                    'LIMIT 1', function(err, rows, field){
                if(err){
                    console.log(err);
                    defer.reject(err);
                }

                //Updating the other bookmark position
                updatePosition = 'UPDATE bookmark set '+
                    'position = position-1 '+
                    'WHERE category_id = '+connection.escape(bookmark.category_id)+' ';
                    if(bookmark.parent != null){
                        updatePosition += 'AND parent = '+connection.escape(bookmark.parent)+' ';
                    } else {
                        updatePosition += 'AND parent is null ';
                    }
                    updatePosition += 'AND position >='+connection.escape(bookmark.position)+' '+
                    'AND user_id ='+idUser;
                connection.query(updatePosition, function(err, rows, field){
                    if(err){
                        console.log(err);
                        defer.reject(err);
                    }

                    defer.resolve(bookmark.id);
                });

            });
        });

        return defer.promise;
    },


    __recursiveDelete: function(idUser, bookmark) {

        var defer = Q.defer();

        module.exports.getChildrenBookmarks(idUser, bookmark, true).then(function(bookmarks) {

            //console.log('done');
            var count = bookmarks.length;

            if(bookmarks.length == 0) {
                defer.resolve();
            }

            //Remove childs first
            bookmarks = bookmarks.reverse();

            for(var i in bookmarks) {

                var sql = 'DELETE FROM bookmark WHERE '+
                    'id = '+parseInt(bookmarks[i].id)+' '+
                    'AND user_id = '+parseInt(idUser)+' '+
                    'LIMIT 1';

                connection.query(sql, function(err, rows, fields) {
                    count--;
                    if(err) {
                        console.log(err);
                        defer.reject(err);
                    }

                    if(count == 0) {
                        defer.resolve();
                    }
                });
            }

        }).catch(function(err){console.log(err)});

        return defer.promise;
    },

    editBookmark: function(idUser, bookmark) {

        var defer = Q.defer();
        var exec = null;
        var that = this;

        this.getBookmark(idUser, bookmark.id).then(function(oldBookmark) {

            if(bookmark.category_id == oldBookmark.category_id) {
                exec = that.__updatePosition(idUser, bookmark, oldBookmark);
            }else{
                exec = that.__updateCategory(idUser, bookmark, oldBookmark);
            }

            exec.then(function(bookmark) {
                return that.__updateBookmark(idUser, bookmark, oldBookmark);
            })
            .then(function(bookmark) {

                defer.resolve(bookmark);
            }).catch(function(error){
                //If an error is thrown during the promise based execution, it will be catch here.
                //If not, the error will be invisible.
                console.log(error);
            });
        });

        return defer.promise;
    },

    __updateCategory: function(idUser, bookmark, oldBookmark) {
        var returnPromise = Q.defer();
        if(bookmark.category_id != oldBookmark.category_id) {

            var parentValue = 'IS NULL';
            if(bookmark.parent) {
                parentValue = '= '+parseInt(bookmark.parent);
            }
            //I retrieve the total of bookmark into the new category
            var getCount = 'SELECT COUNT(id) AS count FROM bookmark '+
                'WHERE category_id = '+parseInt(bookmark.category_id)+' '+
                'AND parent '+parentValue;
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
                    'category_id = '+connection.escape(bookmark.category_id)+', ';
                    //
                    var parent = 'NULL';
                    if(bookmark.parent) {
                        parent = connection.escape(bookmark.parent);
                    }
                    updateCategory += 'parent = '+parent+' '+
                    'WHERE id = '+connection.escape(bookmark.id)+' '+
                    'AND user_id ='+parseInt(idUser);
                connection.query(updateCategory, function(err, rows, fields) {
                    
                    if(err){
                        console.log(err);
                        returnPromise.reject(err);
                    }

                    if(bookmark.bookmark_type_id == 2) {
                        //If this is a folder, I change the category to every children
                        module.exports.__updateChildrenCategory(idUser, bookmark, oldBookmark).then(function(data) {
                            updateBookPromise.resolve(rows[0]);
                        })
                    } else if(bookmark.bookmark_type_id == 1) {
                        updateBookPromise.resolve(rows[0]);
                    }

                    
                });
            });

            var updateOldCategoryPromise = Q.defer();
            updateBookPromise.promise.then(function(update) {
                //Update of the old categroy. Each bookmark after the removed on are de-incremented
                var updateOldPosition = "";
                updateOldPosition = 'UPDATE bookmark SET '+
                    'position = position-1 '+
                    'WHERE category_id = '+connection.escape(oldBookmark.category_id)+' ';
                    if(oldBookmark.parent != null){
                        updateOldPosition += 'AND parent = '+connection.escape(oldBookmark.parent)+' ';
                    } else {
                        updateOldPosition += 'AND parent is NULL ';
                    }
                    updateOldPosition += 'AND position >='+connection.escape(oldBookmark.position)+' '+
                    'AND user_id ='+idUser;

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
                    returnPromise.resolve(module.exports.__updatePosition(idUser, bookmark, oldBookmark));
                } else {
                    returnPromise.resolve(bookmark);
                }
            });

        } else {
            returnPromise.resolve(bookmark);
        }

        return returnPromise.promise;
    },

    getChildrenBookmarks: function(idUser, bookmark, first) {
        if(first) {
            defer = Q.defer();
            childrenBookmarks = new Array();
        }else{
            subDefer[childFn] = Q.defer();
        }

        this.getBookmarks(idUser, bookmark.category_id, bookmark.id).then(function(bookmarks) {

            for(var i in bookmarks) {
                if(bookmarks[i].bookmark_type_id == 2) {

                    childFn++;

                    module.exports.getChildrenBookmarks(idUser, bookmarks[i], false).then(function(books) {
                        childFn--;
                    }).catch(function(err){console.log(err)});
                }
            }
            childrenBookmarks = childrenBookmarks.concat(bookmarks);

            if(childFn == 0) {
                defer.resolve(childrenBookmarks);
            }else{
                subDefer[childFn].resolve(bookmarks);
            }

        }).catch(function(err){console.log(err)});

        if(childFn == 0) {

            return defer.promise;
        }else{

            return subDefer[childFn].promise;
        }
    },

    
    __updateChildrenCategory: function(idUser, bookmark, oldBookmark) {

        var defer = Q.defer();
        module.exports.getChildrenBookmarks(idUser, oldBookmark, true).then(function(bookmarks) {

            //console.log('done');
            var count = bookmarks.length;

            if(bookmarks.length == 0) {
                defer.resolve();
            }
            
            for(var i in bookmarks) {

                var sql = 'UPDATE bookmark SET '+
                    'position = '+i+', '+
                    'category_id = '+connection.escape(bookmark.category_id)+' '+
                    'WHERE id = '+connection.escape(bookmarks[i].id)+' '+
                    'AND user_id ='+parseInt(idUser);

                connection.query(sql, function(err, rows, fields) {
                    count--;
                    if(err) {
                        console.log(err);
                        defer.reject(err);
                    }

                    if(count == 0) {
                        defer.resolve();
                    }
                });
            }

        }).catch(function(err){console.log(err)});

        return defer.promise;
    },

    __updatePosition: function(idUser, bookmark, oldBookmark) {
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
                    'and user_id ='+idUser;
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
                    'and user_id ='+idUser;
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
                        'AND user_id ='+idUser, function(err, rows, fields) {
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
    },

    __updateBookmark: function(idUser, bookmark, oldBookmark) {

        var deferred = Q.defer();

        connection.query('UPDATE bookmark SET '+
            'name='+connection.escape(bookmark.name)+', '+
            'parent='+connection.escape(bookmark.parent)+', '+
            'url='+connection.escape(bookmark.url)+' '+
            'WHERE id='+connection.escape(bookmark.id)+' '+
            'AND user_id='+idUser, function(err, rows, field){
                if(err){
                    deferred.reject(err);
                }

                deferred.resolve(bookmark);
            }
        );

        return deferred.promise;
    }
};

var childFn = 0;
var defer;
var subDefer = new Array();
var childrenBookmarks = new Array();
