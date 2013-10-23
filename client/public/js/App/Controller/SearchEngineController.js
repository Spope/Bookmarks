controllers.controller('SearchEngineController', ['$rootScope', '$scope', 'SearchEngineService', '$window', function($rootScope, $scope, SearchEngineService, $window){

    $scope.search = {search: ""};

    $scope.setSearchBookmark = function() {
        if($scope.updateSearchBookmark) {
            $rootScope.searchBookmark = {
                name: $scope.search.search
            };
        }
    }

    //retrieving searchengines from DB
    SearchEngineService.get().then(function(data) {
        $scope.searchEngines = data;
        $scope.selectedSearchEngine = $scope.searchEngines.filter(function(value) {
            return value.default;
        })[0];
    });

    //search
    $scope.searchFn = function() {
        if($scope.search.search) {
            var url = $scope.selectedSearchEngine.url.replace("{q}", $scope.search.search);
            $window.open(url);
        }
    }

    $scope.setSelectedSearchEngine = function(searchEngine) {
        $scope.selectedSearchEngine = searchEngine;

        if($scope.selectedSearchEngine.url == "bookmarks") {

            $scope.updateSearchBookmark = true;
        } else {
            $rootScope.searchBookmark = null;
            $scope.updateSearchBookmark = false;
        }
    }

}]);
