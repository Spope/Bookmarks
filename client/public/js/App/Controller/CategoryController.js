controllers.controller('CategoryController', ['$scope', 'CategoryService', function ($scope, CategoryService) {

    //retrieving categories from DB
    $scope.categories = CategoryService.getAll();

    
}]);
