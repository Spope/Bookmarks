services.factory('SearchEngineService', ['UserService', '$http', 'resourceCache', function(UserService, $http, resourceCache) {
    var service = {
        get: function() {

            if(!UserService.isLogged) {

                return null;
            }else{

                var promise = $http({
                    method: 'GET',
                    url: '/api/user/'+UserService.user.id+'/searchengines',
                    cache: resourceCache
                })
                .then(
                    function(response) {

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve search engines");
                        return {}
                    }
                );

                return promise;
            }
        },

        getAll: function() {

            if(!UserService.isLogged) {

                return null;
            }else{

                var promise = $http.get('/api/searchengines')
                .then(
                    function(response) {

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve all search engines");
                        return {}
                    }
                );

                return promise;
            }
        },

        save: function(engines) {

            var promise = $http.post('/api/user/'+UserService.user.id+'/searchengines', engines)
                .then(
                    function(response) {

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't save search engines");
                        return {}
                    }
                );

            return promise;
        }
    }

    return service;
}]);
