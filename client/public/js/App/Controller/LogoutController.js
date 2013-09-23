controllers.controller('LogoutController', function ($scope, $http, $location, UserService) {
    $http.get('/api/logout')
    .success(function(data, status, headers, config) {
        UserService.isLogged = false;
        UserService.user     = null;
        $location.path('/login');
    })
    .error(function(data, status, headers, config) {
        UserService.isLogged = false;
        UserService.user     = null;
        $scope.loginError = true;
    });
});
