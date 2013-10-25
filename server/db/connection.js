module.exports = function(mysql, config, test){

    var data = {
        host     : config.host,
        database : config.database,
        user     : config.user,
        password : config.password,
    };
    if(test) {
        data.database = config.database_test;
        data.multipleStatements = true;
    }
    
    var connection = mysql.createConnection(data);

    connection.connect();

    return connection;
}
