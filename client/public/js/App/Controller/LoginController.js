function LoginController($scope, $rootScope, $location, $http, LoginService) {
    
    $scope.user = {login: "", password:"", remember:false};

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
}
