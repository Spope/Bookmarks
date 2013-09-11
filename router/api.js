var bookmarks = [
    {
        name: "Hello",
        url : "http://www.site.com"
    },
    {
        name: "Bonjour",
        url : "http://www.website.com"
    }
]

getBookmarks = function() {
    return bookmarks;
}

module.exports = function(app, connection) {
    app.get('/api/', function(req, res){
        res.json(getBookmarks());
    });

    app.get('/api/bookmarks/', function(req, res){
            connection.query('SELECT * FROM bookmarks', function(err, rows, fields) {
                if (err) throw err;

                res.json(rows);
            });
    });

    app.get('/api/bookmarks/:id', function(req, res){
        if(req.params.id && req.params.id > 0){
            var sql = 'SELECT * FROM bookmarks WHERE id = '+connection.escape(req.params.id);
            connection.query(sql, function(err, rows, fields) {
                if (err) throw err;

                res.json(rows);
            });

        }else{
            res.statusCode = 404;
            return res.send('Error, parameter is not valid');
        }
    });
}
