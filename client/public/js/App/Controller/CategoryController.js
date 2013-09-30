controllers.controller('CategoryController', ['$scope', 'CategoryService', function ($scope, CategoryService) {

    //retrieving categories from DB
    CategoryService.getAll().then(function(data) {
        $scope.categories = data;
    });

    
}]);
