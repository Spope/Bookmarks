controllers.controller('CategoryController', ['$scope', 'CategoryService', 'modalService', function ($scope, CategoryService, modalService) {

    //retrieving categories from DB
    $scope.loadCategory = function() {
        $scope.categories = CategoryService.getAll();
    }

    $scope.loadCategory();

    $scope.addCategory = function() {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                postCategory($scope.category, function(data) {
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

    $scope.editCategory = function(category) {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                saveCategory($scope.category).then(function(data) {
                    $modalInstance.modal('hide');
                });
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                //When modal is leaved, book can be changed but not saved, so I retrieve db info to update display
                //This will retrieve the bookmark into the db (cache=false) and resetting it
                CategoryService.get($scope.category.id, false);
            });
        };
        var template = 'js/App/View/Bookmarks/partial/Modal/editCategory.html';
        var title = 'Edit a category';

        var modalDefault = {
            template: template,
            controller: modalController
        }

        var modalOptions = {
            category: category,
            title: title
        };

        modalService.showModal(modalDefault, modalOptions);
    }

    var saveCategory = function(category) {

        return CategoryService.update(category).then(function(data) {});
    }

    $scope.saveCategory = saveCategory;
}]);
