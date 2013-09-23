controllers.controller('LoginController', function ($scope, $http, $location, UserService) {
    
    $scope.user = {login: "", password:"", remember:false};

    var config = {
        method: 'POST',
        url   : '/api/login',
        data  : $scope.user
    };
    console.log();

    $scope.loginFn = function() {
        $http(config)
        .success(function(data, status, headers, config) {
            if (data && status == 200) {
                UserService.isLogged = true;
                UserService.user     = data;
                //Redirect to home
                $location.path($location.search().redirect).search({});
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

});
