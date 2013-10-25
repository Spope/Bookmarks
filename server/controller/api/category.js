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

    app.get('/api/user/:idUser/category/:id', bootstrap.getSecurity().checkAuth, function(req, res){
        if(req.params.id && req.params.id > 0){
            
            categoryService.getCategory(req.session.user_id, req.params.id).then(function(category) {

                res.json(category);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });



    app.put('/api/user/:idUser/category', bootstrap.getSecurity().checkAuth, function(req, res) {
        var category = req.body;
        category.user_id = req.session.user_id;
        category.parent = 0;

        var defered = categoryService.editCategory(req.session.user_id, category);
        defered.then(function(category){
            res.json(category);
        }).catch(function(err) {console.log(err)});

    });

    app.post('/api/user/:idUser/category', bootstrap.getSecurity().checkAuth, function(req, res){

        var category = req.body;
        category.user_id = req.session.user_id;

        categoryService.addCategory(category).then(function(category){
            res.json(category);
        });
    });


    
}
