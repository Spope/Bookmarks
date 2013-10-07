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

    $scope.editBookmark = function(id) {
        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Delete Customer',
            headerText: 'Delete ?',
            bodyText: 'Are you sure you want to delete this customer?',
            template: 'js/App/View/Bookmarks/partial/Modal/editBookmark.html',
            toto: "Popo"
        };

        modalService.showModal({}, modalOptions);
    }
    
}]);
