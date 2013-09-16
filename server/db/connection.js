module.exports = function(mysql){
    
    var connection = mysql.createConnection({
        host     : 'localhost',
        database : 'bookmarksv2',
        user     : 'root',
        password : 'zr17008',
    });

    connection.connect();

    return connection;
}
