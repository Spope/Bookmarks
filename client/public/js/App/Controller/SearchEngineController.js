controllers.controller('SearchEngineController', ['$scope', 'SearchEngineService', '$window', function($scope, SearchEngineService, $window){

    $scope.search = {search: ""};

    //retrieving searchengines from DB
    SearchEngineService.get().then(function(data) {
        $scope.searchEngines = data;
        $scope.selectedSearchEngine = $scope.searchEngines[0];
    });

    //search
    $scope.searchFn = function() {
        if($scope.search.search) {
            var url = $scope.selectedSearchEngine.url.replace("{q}", $scope.search.search);
            $window.open(url);
        }
    }

    $scope.setSelectedSearchEngine = function(id) {
        $scope.selectedSearchEngine = $scope.searchEngines.filter(function(value, index) {
            return value.id == id;
        })[0];

        $scope.selectedSearchEngine;
    }

}]);
