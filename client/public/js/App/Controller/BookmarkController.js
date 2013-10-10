controllers.controller('BookmarkController', ['$scope', 'BookmarkService', 'modalService', function ($scope, BookmarkService, modalService) {
    
    //retrieving bookmarks from DB
    $scope.parent = null;

    $scope.loadBookmarks = function() {
        BookmarkService.getByCategory($scope.idCategory, $scope.parent).then(function(data) {
            $scope.bookmarks = data;
        });
    }

    $scope.postBookmark = function(bookmark, idCategory, callback){
        bookmark.category_id = idCategory;
        bookmark.position = $scope.bookmarks.length;
        callback.call(null);

        BookmarkService.post(bookmark).then(function(data) {
            if(data.id) {
                bookmark.id = data.id;
                $scope.bookmarks.push(bookmark);
                callback.call(null);
            } else {
                console.error('Error on adding this bookmark');
            }
        });
    }

    $scope.editBookmark = function(bookmark) {

        var modalController = function($scope, $modalInstance) {
            $scope.save = function() {
                BookmarkService.update($scope.bookmark).then(function(data) {
                    bookmark = data;
                });
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                BookmarkService.get($scope.bookmark.category_id, $scope.bookmark.id).then(function(data) {
                    console.log($scope);
                    $scope.bookmark = data;
                });
            });
        }
        var modalDefault = {
            template: 'js/App/View/Bookmarks/partial/Modal/editBookmark.html',
            controller: modalController
        }

        
        var modalOptions = {
            bookmark: bookmark
        };

        //BookmarkService.get(idCategory, id).then(function(data) {
            //modalOptions.bookmark = data;
            modalService.showModal(modalDefault, modalOptions);
        //});

    }
    
}]);
