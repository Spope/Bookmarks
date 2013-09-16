module.exports = function(mysql){
    
    var connection = mysql.createConnection({
        host     : 'localhost',
        database : 'bookmarks',
        user     : 'thomas.devserver',
        password : 'popo',
    });

    connection.connect();

    return connection;
}
