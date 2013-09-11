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

module.exports = function(app) {
    app.get('/api/', function(req, res){
        res.json(getBookmarks());
    });

    app.get('/api/bookmarks/', function(req, res){
        res.json(getBookmarks());
    });
    app.get('/api/bookmarks/:id', function(req, res){
        if(req.params.id && req.params.id > 0){

        }else{
            res.statusCode = 404;
            return res.send('Error, parameter is not valid');
        }
    });
}
