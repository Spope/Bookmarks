controllers.controller('CategoryController', ['$scope', 'CategoryService', 'modalService', function ($scope, CategoryService, modalService) {

    //retrieving categories from DB
    $scope.categories = CategoryService.getAll();

    $scope.addCategory = function() {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                postCategory($scope.newCategory, function(data) {
                    $modalInstance.modal('hide');
                });
            }

        };
        var template = 'js/App/View/Bookmarks/partial/Modal/editCategory.html';
        var title = 'Add a category';

        var modalDefault = {
            template: template,
            controller: modalController
        }

        var category = {};

        var modalOptions = {
            category: category,
            title: title
        };

        modalService.showModal(modalDefault, modalOptions);

    }

    $scope.postCategory = function(category, callback){

        //category.position = CategoryService.getAll().length;

        CategoryService.post(category).then(function(data) {
            if(data.id) {
                callback.call(null);
            } else {
                console.error('Error on adding this category');
            }
        });
    }
    var postCategory = $scope.postCategory;
}]);
