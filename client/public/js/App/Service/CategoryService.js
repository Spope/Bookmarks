services.factory('CategoryService', ['UserService', '$http', function(UserService, $http) {
    var service = {
        getAll: function() {

            if(!UserService.isLogged) {

                return null;
            }else{

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

                return promise;
            }
        }
    }

    return service;
}]);
