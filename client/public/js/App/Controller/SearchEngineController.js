controllers.controller('SearchEngineController', ['$rootScope', '$scope', 'SearchEngineService', '$window', 'LocalBookmarkService', 'CategoryService', 'BookmarkService', '$timeout', function($rootScope, $scope, SearchEngineService, $window, LocalBookmarkService, CategoryService, BookmarkService, $timeout){

    $scope.search = {value: ""};
    var dataset = {};

    $scope.refreshDataset = function() {
        dataset = LocalBookmarkService.getDataset();
    }

    $scope.removeDataset = function() {
        //dataset = {};
    }

    $scope.searchBookmarkFn = function(term) {
        if(term.length > 0) {
            var count = 0;
            var tmp = [].concat(dataset);
            var results = tmp.filter(function(book) {
                if(count < 15) {
                    //fuzzy matching
                    var search = term.toUpperCase();
                    var text   = book.name.toUpperCase();
                    var j = 0; // remembers position of last found character

                    // consider each search character one at a time
                    for (var i = 0; i < search.length; i++) {
                        var l = search[i];
                        if (l == ' ') continue;     // ignore spaces

                        j = text.indexOf(l, j);     // search for character & update position
                        if (j == -1) return false;  // if it's not found, exclude this item
                    }
                    count++;
                    return true;
                }else{
                    return false;
                }
            });

            for(var i in results) {
                if(typeof(results[i].category) != "string") {
                    if(results[i].category == 0) {
                        results[i].category = "Favorites";
                    }else{
                        var cat = CategoryService.get(results[i].category);
                        if(cat) {
                            results[i].category = cat.name;
                            if(cat.name == "__default") {
                                results[i].category = "Favorites";
                            }                    }else{
                            results[i].category = "Can't find category";
                        }
                    }
                }

                if(results[i].parent != "root" && typeof(results[i].parent) != "string" && results[i].parent){
                    var parent = BookmarkService.get(results[i].parent);
                    if(parent) {
                        results[i].parent = parent.name;
                    }
                }else{
                    delete results[i].parent;
                }
            }

            $scope.results = results;
        }else{
            $scope.results = [];
        }
    }

    //retrieving searchengines from DB
    SearchEngineService.get().then(function(data) {
        $scope.searchEngines = data;
        var tmpDefault = $scope.searchEngines.filter(function(value) {
            return value.default;
        })[0];
        $scope.setSelectedSearchEngine(tmpDefault);

    });

    //search
    $scope.searchFn = function(book) {
        if(!$scope.searchBookmark) {
            if(!$scope.search.value) $scope.search.value = "";
            var url = $scope.selectedSearchEngine.url.replace("{q}", $scope.search.value);
            $window.open(url);
        }
        if($scope.searchBookmark && book && book.url) {
            $window.open(book.url);
        }
    }

    $scope.setSelectedSearchEngine = function(searchEngine) {
        $scope.selectedSearchEngine = searchEngine;

        if($scope.selectedSearchEngine.url == "bookmarks") {

            $scope.searchBookmark = true;
        } else {
            $scope.searchBookmark = false;
        }

        //crap
        $timeout(function() {
            $('.input-search:visible').focus();
        });
    }
}]);
