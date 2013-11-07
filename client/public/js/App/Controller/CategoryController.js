controllers.controller('CategoryController', ['$rootScope', '$scope', 'CategoryService', 'modalService', '$q', 'BookmarkService', function ($rootScope, $scope, CategoryService, modalService, $q, BookmarkService) {

    $scope.loadCategory = function() {
        CategoryService.getAll(function(data) {
            $scope.categories = data;
            $scope.favorite = $scope.categories[0];
            $scope.categories = data.splice(1);
        });
    }
    var loadCategory = $scope.loadCategory;
    //retrieving categories from DB
    $scope.pageLoad = function() {
        var next = function(categoryLength) {
            $rootScope.initStep = categoryLength;
            //getting categories from cache
            $scope.loadCategory();
        };

        CategoryService.pageLoad(next);
    }
    $scope.pageLoad();

    $scope.$on('RefreshBookmarks', function(e, args) {
        e.stopPropagation();
        $scope.$broadcast('RefreshBookmarks2', args);
    });

    $scope.addCategory = function() {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                postCategory($scope.category, function(data) {
                    $modalInstance.modal('hide');
                    loadCategory();
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

    var saveCategory = function(category) {

        return CategoryService.update(category).then(function(data) {});
    }

    $scope.saveCategory = saveCategory;

    $scope.removeCategory = function(category) {

        confirmDelete(category).then(function(data){
            CategoryService.remove(category, loadCategory);
        });
    }

    //Alert the popUp 'It will remove children bookmark'
    //and start delete on confirm
    var confirmDelete = function(category) {

        var deferrerd = $q.defer();
        var modalController = function($scope, $modalInstance) {

            $scope.confirm = function() {
                deferrerd.resolve();
                $modalInstance.modal('hide');
            }
            $scope.cancel = function() {
                $modalInstance.modal('hide');
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                deferrerd.reject();
            });
        };

        var modalDefault = {
            template: 'js/App/View/Bookmarks/partial/Modal/confirmBox.html',
            controller: modalController
        }

        var modalOptions = {
            title: 'Warning',
            content: 'This is a category, every bookmarks it contain will be removed.'
        };

        modalService.showModal(modalDefault, modalOptions);

        return deferrerd.promise;
    }
}]);
