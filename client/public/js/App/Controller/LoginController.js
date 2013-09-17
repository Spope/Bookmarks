function LoginController($scope, $rootScope, $location, LoginService) {
    
    $scope.user = {login: "", password:"", remember:false};

    $scope.login = function() {
        $scope.user = LoginService.save($scope.user, function(success) {
            $rootScope.loggedIn = true;
            $location.path('/');
        }, function(error) {
            if(error.data.error) {
                $scope.loginError = true;
            }
        });
    }
}
