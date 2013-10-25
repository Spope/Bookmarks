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
        }
    }

    return service;
}]);
