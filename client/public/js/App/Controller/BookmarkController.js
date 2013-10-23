controllers.controller('BookmarkController', ['$rootScope', '$scope', 'BookmarkService', 'modalService', 'LocalCategoryService', 'LocalBookmarkService', '$q', function ($rootScope, $scope, BookmarkService, modalService, LocalCategoryService, LocalBookmarkService, $q) {
    
    $scope.currentParent = null;
    $scope.backElement = null;

    //retrieving bookmarks from DB
    $scope.loadBookmarks = function(cache) {
        $scope.bookmarks = BookmarkService.getByCategory($scope.idCategory, $scope.currentParent, cache);
    }

    $scope.postBookmark = function(bookmark, callback){

        bookmark.position = BookmarkService.getByCategory(bookmark.category_id, $scope.currentParent).length;

        BookmarkService.post(bookmark).then(function(data) {
            if(data.id) {
                callback.call(null);
            } else {
                console.error('Error on adding this bookmark');
            }
        });
    }
    var postBookmark = $scope.postBookmark;

    var saveBookmark = function(bookmark) {

        return BookmarkService.update(bookmark).then(function(data) {
            $scope.loadBookmarks(false);

            return $scope.bookmarks;
        });
    }

    $scope.saveBookmark = saveBookmark;

    $scope.setParent = function(parent) {

        if(parent) {
            $scope.backElement = BookmarkService.getParent(parent);
        }

        $scope.currentParent = parent;

        $scope.loadBookmarks();
    };

    //Modal stuffs
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
        var template = 'js/App/View/Bookmarks/partial/Modal/editFolder.html';
        var title = 'Edit a folder';
        if(bookmark.bookmark_type_id == 1) {
            template = 'js/App/View/Bookmarks/partial/Modal/editBookmark.html';
            title = 'Edit a bookmark';
        }

        var modalDefault = {
            template: template,
            controller: modalController
        }

        var modalOptions = {
            bookmark: bookmark,
            title: title
        };

        modalService.showModal(modalDefault, modalOptions);

    }

    $scope.addFolder = function(idCategory, parent) {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                postBookmark($scope.bookmark, function(){
                    $modalInstance.modal('hide');
                });
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                //When modal is leaved, book can be changed but not saved, so I retrieve db info to update display
                //This will retrieve the bookmark into the db (cache=false) and resetting it
                BookmarkService.getByCategory(idCategory, parent, false);
            });
        };

        var modalDefault = {
            template: 'js/App/View/Bookmarks/partial/Modal/editFolder.html',
            controller: modalController
        }

        var bookmark = {};
        bookmark.bookmark_type_id = 2;
        bookmark.category_id = idCategory;
        if(parent) {
            bookmark.parent = parent.id;
        }

        var modalOptions = {
            bookmark: bookmark,
            title: 'Create a folder'
        };

        modalService.showModal(modalDefault, modalOptions);

    }

    $scope.removeBookmark = function(bookmark) {

        var bookmark = $scope.deleteBookmark;
        

        if(bookmark.bookmark_type_id == 2) {

            removeFolder(bookmark).then(function(data) {
                deleteBookmark(bookmark);
            });
        } else {

            deleteBookmark(bookmark);
        }

    }

    //Alert the popUp 'It will remove children bookmark'
    //and start delete on confirm
    var removeFolder = function(folder) {

        var deferrerd = $q.defer();
        var modalController = function($scope, $modalInstance, BookmarkService, $q) {

            $scope.confirm = function() {
                deferrerd.resolve();
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
            content: 'This is a folder, every bookmarks it contain will be removed.'
        };

        modalService.showModal(modalDefault, modalOptions);

        return deferrerd.promise;
    }

    var deleteBookmark = function(bookmark) {

        var idCategory = bookmark.category_id;
        var parent;
        if(bookmark.parent) {
            parent = BookmarkService.get(bookmark.parent);
        }

        BookmarkService.remove(bookmark).then(function(data) {
            BookmarkService.getByCategory(idCategory, parent, false);
        });
    }

    
    
}]);
