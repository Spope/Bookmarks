controllers.controller('SearchEngineController', ['$rootScope', '$scope', 'SearchEngineService', '$window', 'LocalBookmarkService', '$templateCache', '$parse', function($rootScope, $scope, SearchEngineService, $window, LocalBookmarkService, $templateCache, $parse){

    $scope.search = {value: ""};

    $scope.refreshDataset = function() {
        //var template = $templateCache.put('type.html', "<small>AA {{parent}}</small><p>{{value}}</p>");
        //var tpl = $parse("<small>AA {{parent}}</small><p>{{value}}</p>");
        //console.log(tpl);
        return {
            template: "<small>AA {{parent}}</small><p>{{value}}</p>",
            local: LocalBookmarkService.getDataset()
        };

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
    $scope.searchFn = function() {
        if(!$scope.searchBookmark && $scope.search.value) {
            var url = $scope.selectedSearchEngine.url.replace("{q}", $scope.search.value);
            $window.open(url);
        }
        //if($scope.searchBookmark && $scope.search.value) {
            //$window.open($scope.search.value);
        //}
    }

    $scope.setSelectedSearchEngine = function(searchEngine) {
        $scope.selectedSearchEngine = searchEngine;

        if($scope.selectedSearchEngine.url == "bookmarks") {

            $scope.searchBookmark = true;
        } else {
            $scope.searchBookmark = false;
        }
        //crap
        $('.input-search').focus();
    }

}]);
