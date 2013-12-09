var bootstrap = require('../modules/bootstrap');
var connection = bootstrap.getConnection();
var Q = bootstrap.getPromise();

module.exports = {

    getSearchEngines: function() {

        var defer = Q.defer();

        var query = "SELECT * FROM search_engine ORDER BY name ASC";
        connection.query(query, function(err, rows, fields) {
            if(err){
                defer.reject(err);
            }

            defer.resolve(rows);
        });

        return defer.promise;
    },

    getUserSearchEngines: function(idUser) {

        var defer = Q.defer();

        var query = 'SELECT search_engine.*, user_search_engine.default FROM search_engine '+
            'LEFT JOIN user_search_engine ON user_search_engine.search_engine_id = search_engine.id '+
            'WHERE user_search_engine.user_id = '+connection.escape(idUser)+' '+
            'ORDER BY name ASC';
        connection.query(query, function(err, rows, fields) {
            if(err){
                defer.reject(err);
            }

            defer.resolve(rows);
        });

        return defer.promise;
    },

    initUser: function(idUser) {

        var defer = Q.defer();

        this.getSearchEngines().then(function(engines) {

            var insert = {};
            var count = engines.length;
            for(var i in engines) {
                var engine = engines[i];
                insert.user_id = idUser;
                insert.search_engine_id = engine.id;
                insert.default = 0;
                if(engine.name == "Google") {
                    insert.default = 1;
                }

                connection.query("INSERT INTO user_search_engine SET ?", insert, function(err, rows) {
                    if(err){
                        defer.reject(err);
                    }

                    count--;
                    if(count == 0) {
                        defer.resolve(idUser);
                    }
                });
            }


        }).catch(function(err){console.log(err)});

        return defer.promise;
    }
}
