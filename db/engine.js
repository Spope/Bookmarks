var bootstrap = require('../modules/bootstrap');
var mysql = bootstrap.getMysql();

module.exports = function (connection) {

    var engine = {
        get : function (table, params, callback) {
            if (!table) throw "No table specified for get";
            if (params && typeof params != "object") throw "Params not well formated for request";

            var sql = 'SELECT * FROM '+table;

            if(params.join){
                sql = addJoin(params.join);
            }

            if(params.where){
                sql += ' WHERE 1';
                for (field in params.where){
                    sql += ' AND '+mysql.escapeId(field)+' = '+connection.escape(params[field]);
                }
            }

            if (params.orderBy) {

            }

            this.query(sql, callback);
            
        },



        query : function(sql, callback) {
            connection.query(sql, function(err, rows, fields) {
                if (err) throw err;

                callback.call(this, rows);
            });
        }
    }

    return engine;
}



var addJoin = function(joins) {
    var sql = "";
    if(typeof join == 'Array') {
        for (join in joins) {
            sql += __addJoin(join);
        }
    }else{
        sql += __addJoin(join);
    }

    return sql;
}


var __addJoin = function(join) {

    return ' JOIN '+join.table+' ON '+join.on;
}
