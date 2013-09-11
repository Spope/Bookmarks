module.exports = function(app, dbEngine) {
    app.get('/api/', function(req, res){
        res.json({});
    });

    app.get('/api/bookmarks/', function(req, res){
        var result = dbEngine.get('bookmarks', {}, function(result){
            res.json(result);
        });
    });

    app.get('/api/bookmarks/:id', function(req, res){
        if(req.params.id && req.params.id > 0){
            var result = dbEngine.get('bookmarks', {id : req.params.id}, function(result){
                res.json(result);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });
}
