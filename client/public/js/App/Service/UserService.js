services.factory('UserService', ['$http', '$location', function($http, $location) {
    var service =  {
        isLogged : false,
        user     : null,

        isLogged : function() {
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
                    if(!autolog) {
                        $scope.loginError = true;
                    }
                }
            })
            .error(function(data, status, headers, config) {
                service.isLogged = false;
                service.user     = null;
                if(!autolog) {
                    $scope.loginError = true;
                }
            });
        }
    }

    return service;

}]);


