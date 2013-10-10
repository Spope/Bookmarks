services.factory('CategoryService', ['UserService', 'LocalCategoryService', '$http', function(UserService, LocalCategoryService, $http) {
    var service = {
        getAll: function() {

            if(!UserService.isLogged) {

                return null;
            }else{

                if(LocalCategoryService.getCategories() === false) {

                    var promise = $http.get('/api/user/'+UserService.user.id+'/categories')
                    .then(
                        function(response) {

                            return response.data;
                        },
                        function(data) {
                            console.error("Can't retrieve categories");
                            return {}
                        }
                    );

                    return promise.then(function(data) {

                        LocalCategoryService.setCategories(data);

                        return data;
                    });

                } else {
                    return LocalCategoryService.getCategories();
                }
            }
        }
    }

    return service;
}]);
