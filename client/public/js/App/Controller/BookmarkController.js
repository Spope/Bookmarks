controllers.controller('BookmarkController', ['$scope', 'BookmarkService', function ($scope, BookmarkService) {
    
    //retrieving bookmarks from DB
    $scope.loadBookmarks = function() {
        BookmarkService.getByCategory($scope.idCategory).then(function(data) {
            $scope.bookmarks = data;
        });
    }
}]);
