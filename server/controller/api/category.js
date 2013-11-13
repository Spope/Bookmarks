var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection();
var categoryService = require('../../service/CategoryService');

module.exports = function(app) {


    //page load
    app.get('/api/user/:idUser/load', bootstrap.getSecurity().checkAuth, function(req, res){

        var request = categoryService.pageLoad(req.user.id);
        request.then(function(bookmarks){

            res.json(bookmarks);
        });

    });



    app.get('/api/user/:idUser/categories', bootstrap.getSecurity().checkAuth, function(req, res){

        if(req.params.idUser == req.user.id) {
            categoryService.getUserCategory(req.user.id).then(function(categories) {

                res.json(categories);
            });
        }else{

            res.statusCode = 401;
            return res.send("This isn't really you rigth ?");
        }

    });

    app.get('/api/user/:idUser/category/:id', bootstrap.getSecurity().checkAuth, function(req, res){
        if(req.params.id && req.params.id > 0){
            
            categoryService.getCategory(req.user.id, req.params.id).then(function(category) {

                res.json(category);
            });

        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });



    app.put('/api/user/:idUser/category', bootstrap.getSecurity().checkAuth, function(req, res) {
        var category = req.body;
        category.user_id = req.user.id;
        category.parent = 0;

        var defered = categoryService.editCategory(req.user.id, category);
        defered.then(function(category){
            res.json(category);
        }).catch(function(err) {console.log(err)});

    });

    app.post('/api/user/:idUser/category', bootstrap.getSecurity().checkAuth, function(req, res){

        var category = req.body;
        category.user_id = req.user.id;

        categoryService.addCategory(category).then(function(category){
            res.json(category);
        });
    });


    app.delete('/api/user/:idUser/category/:idCategory', bootstrap.getSecurity().checkAuth, function(req, res) {

        if(req.params.idCategory && req.params.idCategory > 0){
            categoryService.getCategory(req.user.id, req.params.idCategory).then(function(category) {

                categoryService.deleteCategory(req.user.id, category).then(function(bookmark){
                    return res.json(category);
                });

            }).catch(function(err) {console.log(err)});
        }else{
            res.statusCode = 404;

            return res.send('Error, parameter is not valid');
        }
    });


    
}
