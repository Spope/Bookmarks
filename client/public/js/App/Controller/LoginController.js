controllers.controller('LoginController', function ($scope, $http, $location, UserService) {
    
    $scope.user = {login: "", password:"", remember:false};
    var config = {
        method: 'POST',
        url   : '/api/login',
        data  : $scope.user
    };

    $scope.loginFn = function(autolog) {
        if(autolog) {
            config.data.autolog = true;
        }
        $http(config)
        .success(function(data, status, headers, config) {
            if (data && status == 200) {
                UserService.isLogged = true;
                UserService.user     = data;
                //Redirect to home
                var redirect = '/';
                if($location.search().redirect){
                    redirect = $location.search().redirect;
                }
                $location.path(redirect).search({});
            } else {
                UserService.isLogged = false;
                UserService.user     = null;
                $scope.loginError = true;
            }
        })
        .error(function(data, status, headers, config) {
            UserService.isLogged = false;
            UserService.user     = null;
            $scope.loginError = true;
        });
    }

    $scope.loginFn(true);

});
