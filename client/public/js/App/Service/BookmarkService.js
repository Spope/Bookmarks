services.factory('BookmarkService', ['UserService', '$http', 'LocalBookmarkService', function(UserService, $http, LocalBookmarkService) {
    var service = {
        pageLoad: function(next) {

            var url = '/api/user/'+UserService.user.id+'/bookmarks';
            var promise = $http.get(url)
                .then(
                    function(response) {

                        
                        var bookmarks = response.data;

                        for(var i in bookmarks) {
                            LocalBookmarkService.addBookmark(bookmarks[i]);
                        }

                        if(typeof(next) == 'function') {
                            next();
                        }

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve bookmarks");
                        return {}
                    }
                );

            return promise;
        },


        getByCategory: function(idCategory, parent, cache, next) {

            if(!UserService.isLogged) {

                return null;
            }else{

                if(LocalBookmarkService.getByCategory(idCategory, parent) === false || cache === false) {
                    var url = "";
                    if(parent) {
                        url = '/api/user/'+UserService.user.id+'/category/'+idCategory+'/parent/'+parent.id;
                    } else {
                        url = '/api/user/'+UserService.user.id+'/category/'+idCategory+'/bookmarks';
                    }
                    var promise = $http.get(url)
                    .then(
                        function(response) {

                            if(typeof(next) == 'function') {
                                next();
                            }
                            return response.data;
                        },
                        function(data) {
                            console.error("Can't retrieve bookmarks");
                            return {}
                        }
                    );

                    return promise.then(function(data) {

                        LocalBookmarkService.setByCategory(idCategory, parent, data);

                        return data;
                    });
                } else {

                    if(typeof(next) == 'function') {
                        next(LocalBookmarkService.getByCategory(idCategory, parent));
                    }

                    return LocalBookmarkService.getByCategory(idCategory, parent);
                }
            }
        },

        get: function(id, cache) {

            if(!UserService.isLogged) {

                return null;
            } else {

                if(LocalBookmarkService.get(id) === false || cache === false) {
                    var promise = $http.get('/api/user/'+UserService.user.id+'/bookmark/'+id)
                    .then(
                        function(response) {

                            return response.data;
                        },
                        function(data) {
                            console.error("Can't retrieve bookmark");
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
            var promise = $http.post('/api/user/'+UserService.user.id+'/bookmark', bookmark)
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
                    console.error("can't refresh data after post bookmark");
                }

                return data;
            });
        },

        getParent: function(bookmark) {
            return LocalBookmarkService.getParent(bookmark);
        },



        update: function(bookmark) {
            var promise = $http.put('/api/user/'+UserService.user.id+'/bookmark', bookmark)
            .then(
                function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't update a bookmark");
                    return {}
                }
            )

            return promise;
        },

        remove: function(bookmark) {

            var promise = $http.delete('/api/user/'+UserService.user.id+'/bookmark/'+bookmark.id)
            .then(
                function(response) {
                    return response;
                },
                function(response) {
                    console.log("Error on removing the bookmark");
                    return {};
                }
            );
            //the localbookmarkservice is update into the controller.
            //It could be done here too.

            return promise;
        }
    }

    return service;
}]);
