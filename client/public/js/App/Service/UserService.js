services.factory('UserService', ['$http', '$location', '$q', '$timeout', 'resourceCache', function($http, $location, $q, $timeout, resourceCache) {
    var service =  {
        isLogged  : false,
        user      : null,
        isFinished: false,

        log : function() {

            var defer = $q.defer();
            var config = {
                method: 'GET',
                url   : '/api/islogged',
                cache : resourceCache
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

                this.isFinished = true;
                defer.resolve();
            })
            .error(function(data, status, headers, config) {
                service.isLogged = false;
                service.user     = null;

                this.isFinished = true;
                defer.reject(data);
            });

            return defer.promise;
        }
    }

    return service;

}]);

