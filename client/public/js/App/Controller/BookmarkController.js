controllers.controller('BookmarkController', ['$scope', 'BookmarkService', 'modalService', 'LocalCategoryService', 'LocalBookmarkService', function ($scope, BookmarkService, modalService, LocalCategoryService, LocalBookmarkService) {
    
    //retrieving bookmarks from DB
    $scope.currentParent = null;
    $scope.backElement = null;

    $scope.loadBookmarks = function() {
        $scope.bookmarks = BookmarkService.getByCategory($scope.idCategory, $scope.currentParent);
    }

    $scope.postBookmark = function(bookmark, idCategory, callback){

        bookmark.category_id = idCategory;
        bookmark.position = BookmarkService.getByCategory(idCategory, $scope.currentParent).length;

        BookmarkService.post(bookmark).then(function(data) {
            if(data.id) {
                callback.call(null);
            } else {
                console.error('Error on adding this bookmark');
            }
        });
    }

    var saveBookmark = function(bookmark) {

        return BookmarkService.update(bookmark);
    }

    $scope.saveBookmark = saveBookmark;

    $scope.editBookmark = function(bookmark) {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                saveBookmark($scope.bookmark).then(function(data) {
                    $modalInstance.modal('hide');
                });
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                //When modal is leaved, book can be changed but not saved, so I retrieve db info to update display
                //This will retrieve the bookmark into the db (cache=false) and resetting it
                BookmarkService.get($scope.bookmark.id, false);
            });
        };

        var modalDefault = {
            template: 'js/App/View/Bookmarks/partial/Modal/editBookmark.html',
            controller: modalController
        }

        var modalOptions = {
            bookmark: bookmark
        };

        modalService.showModal(modalDefault, modalOptions);

    }

    $scope.setParent = function(parent) {

        $scope.backElement = $scope.currentParent;

        $scope.currentParent = parent;

        $scope.loadBookmarks();
    };
    
}]);
