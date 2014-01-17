controllers.controller('LogoutController', ['$scope', '$http', '$location', 'UserService', '$window', function ($scope, $http, $location, UserService, $window) {
    $http.get('/api/logout')
    .success(function(data, status, headers, config) {
        UserService.isLogged = false;
        UserService.user     = null;
        //force a page reload to empty preloaded div data
        $window.location.href = "/";
    })
    .error(function(data, status, headers, config) {
        UserService.isLogged = false;
        UserService.user     = null;
        $scope.loginError = true;
    });
}]);
