controllers.controller('RegisterController', ['$scope', '$http', '$location', 'UserService', function ($scope, $http, $location, UserService) {
    
    $scope.user = {login: "", password:"", remember:false};
    $scope.loginError = false;
    var config = {
        method: 'POST',
        url   : '/api/register',
        data  : $scope.user
    };

    $scope.registerFn = function() {

    if($scope.user.password != $scope.user.password2) {

        return false;
    }

        $http(config)
        .success(function(data, status, headers, config) {
            
            if (data && status == 200 && data == 'OK') {
                //Redirect to home
                var redirect = '/';
                if($location.search().redirect){
                    redirect = $location.search().redirect;
                }
                $location.path(redirect).search({});
            } else {
                $scope.loginError = true;
            }
            
        })
        .error(function(data, status, headers, config) {
            UserService.isLogged = false;
            UserService.user     = null;
                $scope.loginError = true;
        });
    }

}]);
