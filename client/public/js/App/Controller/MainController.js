controllers.controller('MainController', ['$scope', 'UserService', function ($scope, UserService) {
    
    $scope.user = UserService.user;

}]);
