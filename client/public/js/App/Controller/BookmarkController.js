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
        return true;
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

    $scope.editBookmark = function(idCategory, id) {

        var modalDefault = {
            template: 'js/App/View/Bookmarks/partial/Modal/editBookmark.html'
        }
        var modalOptions = {
        };

        BookmarkService.get(idCategory, id).then(function(data) {
            modalOptions.bookmark = data;
            modalService.showModal(modalDefault, modalOptions);
        });

        
    }
    
}]);
