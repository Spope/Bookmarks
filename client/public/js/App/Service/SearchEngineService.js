services.factory('SearchEngineService', ['UserService', '$http', function(UserService, $http) {
    var service = {
        get: function() {
            console.log(UserService);

            if(!UserService.isLogged) {

                return null;
            }else{

                var promise = $http.get('/api/user/'+UserService.user.id+'/searchengines')
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
        }
    }

    return service;
}]);
