var bootstrap = require('../modules/bootstrap');
var connection = bootstrap.getConnection();
var Q = bootstrap.getPromise();

module.exports = {

    getUserCategory: function(idUser) {

        var defer = Q.defer();

        var sql = 'SELECT * FROM category '+
            'WHERE user_id = '+connection.escape(idUser)+' ';
            'ORDER BY position';

        connection.query(sql, function(err, rows, fields){
            if(err){
                defer.reject(err);
            }
            defer.resolve(rows);
        });

        return defer.promise;
    },

    getCategory: function(idUser, id) {

        var defer = Q.defer();

        var sql = 'SELECT * FROM category '+
            'WHERE user_id ='+connection.escape(idUser)+' '+
            'AND id = '+connection.escape(id)+' '+
            'LIMIT 1';

        connection.query(sql, function(err, rows, field){
            if(err){
                defer.reject(err);
            }
            defer.resolve(rows[0]);
 
        });

        return defer.promise;
    },

    pageLoad: function(idUser){

        var defer = Q.defer();

        var sql = "SELECT "+
            "`category`.`id`, `category`.`name`, `category`.`user_id`, "+
            "`bookmark`.`id`, `bookmark`.`name`, `bookmark`.`url`, `bookmark`.`position`, `bookmark`.`parent`, `bookmark`.`user_id`, `bookmark`.`category_id`, `bookmark`.`bookmark_type_id` "+

            "FROM `category` "+
            "JOIN `bookmark` on `bookmark`.`category_id` = `category`.`id` "+

            "WHERE `category`.`user_id` = "+idUser+" "+
            //"AND `bookmark`.`parent` IS NULL "+

            "ORDER BY `bookmark`.`position`";

        //nestTable to retrieve table name for the join
        var options = {sql: sql, nestTables: '_'};
        connection.query(options, function(err, rows, field){

            var out = new Array();
            var cc = null;
            for(var i in rows){
                if(rows[i]) {

                    if(!out[rows[i].category_id]) {
                        out[rows[i].category_id] = {
                            id: rows[i].category_id,
                            name: rows[i].category_name,
                            user_id: rows[i].category_user_id,
                            bookmarks: []
                        }
                    };

                    var tb = {
                        id: rows[i].bookmark_id,
                        name: rows[i].bookmark_name,
                        url: rows[i].bookmark_url,
                        position: rows[i].bookmark_position,
                        parent: rows[i].bookmark_parent,
                        user_id: rows[i].bookmark_user_id,
                        category_id: rows[i].bookmark_category_id,
                        bookmark_type_id: rows[i].bookmark_bookmark_type_id,
                    };
                    out[rows[i].category_id].bookmarks.push(tb)
                }
                
            }
            //remove null key => ["", "", 2, "", 4]
            out = out.filter(function() { return true; });
            defer.resolve(out);
        });

        return defer.promise;
    },




    editCategory: function(idUser, category) {

        var defer = Q.defer();

        this.getCategory(idUser, category.id).then(function(oldCategory) {

            connection.query('UPDATE category SET '+
                'name='+connection.escape(category.name)+', '+
                'parent='+connection.escape(category.parent)+' '+
                'WHERE id='+connection.escape(category.id)+' '+
                'AND user_id='+idUser, function(err, rows, field){
                    if(err){
                        console.log(err);
                        defer.reject(err);
                    }

                    defer.resolve(category);
                }
            );

        });
        return defer.promise;
    },

    addCategory: function(category) {
        var defer = Q.defer();

        connection.query('INSERT INTO category SET ?', category, function(err, rows, field){
            if(err){
                console.log(err);
                defer.reject(err);
            }

            var sql = 'SELECT * FROM category '+
                'WHERE user_id = '+connection.escape(category.user_id)+' '+
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

    deleteCategory: function(idUser, category) {
        var defer = Q.defer();

        connection.query('DELETE FROM bookmark WHERE category_id = '+connection.escape(category.id)+' AND user_id='+connection.escape(idUser), function(err, rows, field){
            if(err){
                console.log(err);
                defer.reject(err);
            }

            var sql = 'DELETE FROM category '+
                'WHERE user_id = '+connection.escape(idUser)+' '+
                'AND id = '+connection.escape(category.id)+' '+
                'LIMIT 1';

            connection.query(sql, function(err, rows, field){
                if(err){
                    defer.reject(err);
                }

                defer.resolve(rows);
            });
        });

        return defer.promise;
    }
}
