var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();
var categoryService = require('../../service/CategoryService');

module.exports = function(app) {

    app.get('/api/user/:idUser/categories', bootstrap.getSecurity().checkAuth, function(req, res){

        if(req.params.idUser == req.session.user_id) {
            categoryService.getUserCategory(req.session.user_id).then(function(categories) {

                res.json(categories);
            });
        }else{

            res.statusCode = 401;
            return res.send("This isn't really you rigth ?");
        }

    });

    app.post('/api/user/:idUser/category', bootstrap.getSecurity().checkAuth, function(req, res){

        var category = req.body;
        category.user_id = req.session.user_id;

        categoryService.addCategory(category).then(function(category){
            res.json(category);
        });
    });


    //app.get('/api/categories/:id', bootstrap.getSecurity().checkAuth, function(req, res){
        //if(req.params.id && req.params.id > 0){
            //var sql = 'SELECT * FROM category '+
                //'WHERE user_id ='+connection.escape(req.session.user_id)+' '+
                //'AND id = '+connection.escape(req.params.id)+' '+
                //'LIMIT 1';

            //connection.query(sql, function(err, rows, field){
                    //res.json(rows);
            //});

        //}else{
            //res.statusCode = 404;

            //return res.send('Error, parameter is not valid');
        //}
    //});
}
