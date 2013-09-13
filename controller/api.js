var bootstrap = require('../modules/bootstrap');

module.exports = function(app) {
    app.get('/api/', function(req, res){
        res.json({});
    });

    app.get('/api/bookmarks/', bootstrap.getSecurity().checkAuth, function(req, res){
        var result = bootstrap.getDbEngine().get('bookmark', {}, function(result){
            res.json(result);
        });
    });

    app.get('/api/bookmarks/:id', function(req, res){
        if(req.params.id && req.params.id > 0){
            var result = bootstrap.getDbEngine().get('bookmark', {id : req.params.id}, function(result){
                res.json(result);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });
}
