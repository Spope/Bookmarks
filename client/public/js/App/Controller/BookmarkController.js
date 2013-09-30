controllers.controller('BookmarkController', ['$scope', 'BookmarkService', function ($scope, BookmarkService) {
    
    //retrieving bookmarks from DB
    $scope.loadBookmarks = function() {
        BookmarkService.getByCategory($scope.idCategory).then(function(data) {
            $scope.bookmarks = data;
        });
    }

    $scope.postBookmark = function(bookmark, idCategory){
        bookmark.category_id = idCategory;
        bookmark.position = $scope.bookmarks.length;
        BookmarkService.post(bookmark).then(function(data) {
            $scope.bookmarks = data;
        });
    }
}]);
