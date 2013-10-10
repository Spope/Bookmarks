services.factory('BookmarkService', ['UserService', '$http', function(UserService, $http) {
    var service = {
        getByCategory: function(idCategory, parent) {

            if(!UserService.isLogged) {

                return null;
            }else{

                var promise = $http.get('/api/user/'+UserService.user.id+'/category/'+idCategory+'/bookmarks')
                .then(
                    function(response) {

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve bookmarks");
                        return {}
                    }
                );

                return promise;
            }
        },

        get: function(idCategory, id) {

            if(!UserService.isLogged) {

                return null;
            } else {

                var promise = $http.get('/api/user/'+UserService.user.id+'/category/'+idCategory+'/bookmark/'+id)
                .then(
                    function(response) {

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve bookmarks");
                        return {}
                    }
                );

                return promise;
            }
        },

        post: function(bookmark) {
            var promise = $http.post('/api/user/'+UserService.user.id+'/category/'+bookmark.category_id+'/bookmark', bookmark)
            .then(
                    function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't add a bookmark");
                    return {}
                }
            )

            return promise;
        },

        update: function(bookmark) {
            var promise = $http.put('/api/user/'+UserService.user.id+'/category/'+bookmark.category_id+'/bookmark', bookmark)
            .then(
                    function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't add a bookmark");
                    return {}
                }
            )

            return promise;
        }
    }

    return service;
}]);
