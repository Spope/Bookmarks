controllers.controller('FavoriteController', ['$rootScope', '$scope', 'BookmarkService', function ($rootScope, $scope, BookmarkService) {


    $scope.loadBookmarks = function(cache) {
        $scope.bookmarks = BookmarkService.getByCategory($scope.category.id, $scope.currentParent, cache);
    }

    $scope.$watch('favorite', function() {
        if($scope.favorite && $scope.favorite.id) {
            $scope.category = $scope.favorite;
            $scope.loadBookmarks();
        }
    });

    
    var saveBookmark = function(bookmark) {

        if(bookmark.bookmark_type_id != 1) {

        } else {
            return BookmarkService.update(bookmark).then(function(data) {
                $scope.loadBookmarks(false);
                //If the bookmarks has a new category
                if(bookmark.category_id != $scope.category.id) {
                    
                    //Sending event to parent scope which will stop and send it to all children scope.
                    //Only the scope of the category will be updated.
                    $scope.$emit('RefreshBookmarks', bookmark.category_id);
                    //BookmarkService.getByCategory(bookmark.category_id, null, false);
                }

                return $scope.bookmarks;
            });
        }
    }

    $scope.saveBookmark = saveBookmark;

}]);
