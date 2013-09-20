controllers.controller('LoginController', function ($scope, $http, UserService) {
    
    $scope.user = {login: "", password:"", remember:false};

    var config = {
        method: 'POST',
        url   : '/login',
        data  : $scope.user
    };

    $http(config)
    .success(function(data, status, headers, config) {
        if (data.status) {
            UserService.isLogged = true;
            UserService.user     = data;
        } else {
            UserService.isLogged = false;
            UserService.user     = null;
        }
    })
    .error(function(data, status, headers, config) {
        UserService.isLogged = false;
        UserService.user     = null;
    });
    /*
    $scope.login = function() {
        $scope.user = LoginService.save($scope.user, function(success) {
            $rootScope.loggedIn = true;
            $location.path('/');
            $rootScope = $http.get('/api/user/'+success.id);
            
        }, function(error) {
            if(error.data.error) {
                $scope.loginError = true;
            }
        });
    }
    */
});
