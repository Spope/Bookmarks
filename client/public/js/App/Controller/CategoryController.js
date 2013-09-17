function CategoryController($scope, CategoryService) {

    $scope.categories = CategoryService.query();
}
