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
}
