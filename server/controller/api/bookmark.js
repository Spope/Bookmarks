var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();
var Q = bootstrap.getPromise();
var bookmarkService = require('../../service/BookmarkService');

module.exports = function(app) {

    app.get('/api/user/:idUser/category/:idCat/bookmarks', bootstrap.getSecurity().checkAuth, function(req, res){

        var request = bookmarkService.getBookmarks(req.session.user_id, req.params.idCat);
        request.then(function(bookmarks){

            res.json(bookmarks);
        });

    });

    app.get('/api/user/:idUser/category/:idCat/parent/:idparent', bootstrap.getSecurity().checkAuth, function(req, res){

        var request = bookmarkService.getBookmarks(req.session.user_id, req.params.idCat, req.params.idparent);
        request.then(function(bookmarks){

            res.json(bookmarks);
        });

    });


    app.get('/api/user/:idUser/bookmark/:id', bootstrap.getSecurity().checkAuth, function(req, res){
        if(req.params.id && req.params.id > 0){
            
            var request = bookmarkService.getBookmark(req.session.user_id, req.params.id);
            request.then(function(bookmark) {
                res.json(bookmark);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });

    app.post('/api/user/:idUser/bookmark', bootstrap.getSecurity().checkAuth, function(req, res) {
        var bookmark = req.body;
        bookmark.user_id = req.session.user_id;
        bookmark.bookmark_type_id = 1;

        bookmarkService.addBookmark(bookmark).then(function(bookmark){
            res.json(bookmark);
        });

    });

    app.put('/api/user/:idUser/bookmark', bootstrap.getSecurity().checkAuth, function(req, res) {
        var bookmark = req.body;
        bookmark.user_id = req.session.user_id;
        bookmark.bookmark_type_id = 1;

        var defered = bookmarkService.editBookmark(req.session.user_id, bookmark);
        defered.then(function(bookmark){
            return res.json(bookmark);
        })

    });

}
