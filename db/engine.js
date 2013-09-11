module.exports = function (connection, dbEngine) {
    
    dbEngine.get = function (table, params, callback) {
        if (!table) throw "No table specified for get";
        if (params && typeof params != "object") throw "Params not well formated for request";

        var sql = 'SELECT * FROM '+table+' WHERE 1';

        if(params){
            for (field in params){
                sql += ' AND '+field+' = '+connection.escape(params[field]);
            }
        }

        this.__query(sql, callback);
        
    }



    dbEngine.__query = function(sql, callback) {
        connection.query(sql, function(err, rows, fields) {
            if (err) throw err;

            callback.call(this, rows);
        });
    }
}
