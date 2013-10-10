services.factory('BookmarkService', ['UserService', '$http', 'LocalBookmarkService', function(UserService, $http, LocalBookmarkService) {
    var service = {
        getByCategory: function(idCategory, parent) {

            if(!UserService.isLogged) {

                return null;
            }else{

                if(LocalBookmarkService.getByCategory(idCategory) === false) {
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

                    return promise.then(function(data) {

                        LocalBookmarkService.setByCategory(idCategory, data);

                        return data;
                    });
                } else {

                    return LocalBookmarkService.getByCategory(idCategory);
                }
            }
        },

        get: function(idCategory, id) {

            if(!UserService.isLogged) {

                return null;
            } else {

                if(LocalBookmarkService.get(id) === false) {
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

                    return promise.then(function(data) {

                        LocalBookmarkService.setBookmark(data);

                        return data;
                    });
                } else {

                    return LocalBookmarkService.get(id);
                }
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

            return promise.then(function(data) {

                if(!LocalBookmarkService.addBookmark(data)) {
                    console.error("can't refresh data after post");
                }

                return data;
            });
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
