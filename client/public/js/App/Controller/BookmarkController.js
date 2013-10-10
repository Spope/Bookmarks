controllers.controller('BookmarkController', ['$scope', 'BookmarkService', 'modalService', 'LocalCategoryService', 'LocalBookmarkService', function ($scope, BookmarkService, modalService, LocalCategoryService, LocalBookmarkService) {
    
    //retrieving bookmarks from DB
    $scope.parent = null;

    $scope.loadBookmarks = function() {
        $scope.bookmarks = BookmarkService.getByCategory($scope.idCategory);
    }

    $scope.postBookmark = function(bookmark, idCategory, callback){

        bookmark.category_id = idCategory;
        bookmark.position = BookmarkService.getByCategory(idCategory).length;

        BookmarkService.post(bookmark).then(function(data) {
            if(data.id) {
                callback.call(null);
            } else {
                console.error('Error on adding this bookmark');
            }
        });
    }

    $scope.editBookmark = function(bookmark) {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                BookmarkService.update($scope.bookmark).then(function(data) {
                    $modalInstance.modal('hide');
                });
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                //Whene modal is leaved, book can be changed but not saved, so I retrieve db info to update display
                var bookmark = BookmarkService.get($scope.bookmark.category_id, $scope.bookmark.id);
                if(!LocalBookmarkService.setBookmark(bookmark)) {
                    console.error("Can't refresh bookmark");
                }
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
    
}]);
