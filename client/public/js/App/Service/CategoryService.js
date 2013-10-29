services.factory('CategoryService', ['UserService', 'LocalCategoryService', '$http', function(UserService, LocalCategoryService, $http) {
    var service = {
        getAll: function(next) {

            if(!UserService.isLogged) {

                return null;
            }else{

                if(LocalCategoryService.getCategories() === false) {

                    $http.get('/api/user/'+UserService.user.id+'/categories')
                    .success(
                        function(data, status, headers, config) {

                            next(data);
                    }).error(
                        function(data, status, headers, config) {
                            console.error("Can't retrieve categories");
                            return {}
                        }
                    );

                } else {
                    next(LocalCategoryService.getCategories());
                }
            }
        },

        get: function(id, cache) {

            if(!UserService.isLogged) {

                return null;
            } else {

                if(LocalCategoryService.get(id) === false || cache === false) {
                    var promise = $http.get('/api/user/'+UserService.user.id+'/category/'+id)
                    .then(
                        function(response) {

                            return response.data;
                        },
                        function(data) {
                            console.error("Can't retrieve category");
                            return {}
                        }
                    );

                    return promise.then(function(data) {

                        LocalCategoryService.setCategory(data);

                        return data;
                    });
                } else {

                    return LocalCategoryService.get(id);
                }
            }
        },

        post: function(category) {

            var promise = $http.post('/api/user/'+UserService.user.id+'/category', category)
            .then(
                    function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't add a category");
                    return {}
                }
            )

            return promise.then(function(data) {

                if(!LocalCategoryService.addCategory(data)) {
                    console.error("can't refresh data after post category");
                }

                return data;
            });
        },

        update: function(category) {

            var promise = $http.put('/api/user/'+UserService.user.id+'/category', category)
            .then(
                function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't update a category");
                    return {}
                }
            )

            return promise;
        },

        remove: function(category) {

            var promise = $http.delete('/api/user/'+UserService.user.id+'/category/'+category.id)
            .then(
                function(response) {
                    LocalCategoryService.remove(category);
                    return response;
                },
                function(response) {
                    console.log("Error on removing the category");
                    return {};
                }
            );

            return promise;
        }
    }

    return service;
}]);
