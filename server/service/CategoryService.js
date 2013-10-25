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
    }
}
