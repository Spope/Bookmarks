services.factory('UserService', ['$http', '$location', '$q', function($http, $location, $q) {
    var service =  {
        isLogged : false,
        user     : null,

        isLogged : function() {

            var defer = $q.defer();
            var config = {
                method: 'GET',
                url   : '/api/islogged'
            };

            $http(config)
            .success(function(data, status, headers, config) {
                if (data && status == 200) {
                    service.isLogged = true;
                    service.user     = data;
                    //Redirect to home
                    var redirect = '/';
                    if($location.search().redirect){
                        redirect = $location.search().redirect;
                    }
                    $location.path(redirect).search({});
                } else {
                    service.isLogged = false;
                    service.user     = null;
                }

                defer.resolve();
            })
            .error(function(data, status, headers, config) {
                service.isLogged = false;
                service.user     = null;

                defer.resolve();
            });

            return defer.promise;
        }
    }

    return service;

}]);


