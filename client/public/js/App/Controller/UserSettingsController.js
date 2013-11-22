var UserSettingsController = function($rootScope, $scope, $modalInstance, LocalBookmarkService, SearchEngineService) {
    
    $scope.userSearchEngines = null;
    $scope.searchEngines = null;
    //loading the user search engines
    SearchEngineService.get().then(function(data) {
        $scope.userSearchEngines = data;
        
        $scope.defaultSearchEngine = $scope.userSearchEngines.filter(function(value) {
            return value.default;
        })[0];
    });
    //loading all search engines
    SearchEngineService.getAll().then(function(data){
        $scope.searchEngines = data;
    });

    $scope.$watch('userSearchEngines', function(){refresh()});
    $scope.$watch('searchEngines', function(){refresh()});

    var refresh = function(){
        //When search engines are loaded, is set the view vars.
        if($scope.userSearchEngines && $scope.searchEngines && $scope.userSearchEngines.length>0 && $scope.searchEngines.length>0){
            for(var i in $scope.searchEngines){
                var searchEngine = $scope.searchEngines[i];

                var found = $scope.userSearchEngines.filter(function(s){
                    return s.id == searchEngine.id;
                });
                if(found.length > 0) {
                    $scope.searchEngines[i].selected = true;
                }else{
                    $scope.searchEngines[i].selected = false;
                }

                if(searchEngine.id == $scope.defaultSearchEngine.id) {
                    $scope.searchEngines[i].default = 1;
                }else{
                    $scope.searchEngines[i].default = 0;
                }
            }
        }
    }

    $scope.toggleSearchEngine = function(searchEngine) {
        if(!searchEngine.selected){
            searchEngine.selected = true;
            return true;
        }
        // Check if the user is not deselecting the last one.
        var selectedEngines = $scope.searchEngines.filter(function(s){ return s.selected});
        if(selectedEngines.length > 1){
            searchEngine.default = 0; // When unselected, a search engine is no longer the default one.
            searchEngine.selected = false;
        }
        if(selectedEngines.length == 2){
            // If only one search engine left, it becomes the default one.
            $scope.searchEngines.filter(function(s){ return s.selected})[0].default = true;
        }
    }

    $scope.toggleDefaultSearchEngine = function(searchEngine) {
        for(var i in $scope.searchEngines){
            $scope.searchEngines[i].default = 0;
            if($scope.searchEngines[i].id == searchEngine.id){
                $scope.searchEngines[i].default = 1;
            }
        }
    }

    $scope.save = function() {
        var selectedSearchEngine = [];
        var defaultEngine = $scope.searchEngines.filter(function(s){ return s.default});
        if(defaultEngine.length == 0) {

            $scope.errorDefault = true;
            return false;
        }
        for (var i in $scope.searchEngines) {
            var engine = $scope.searchEngines[i];
            if(engine.selected){
                selectedSearchEngine.push(engine);
            }
        }
        SearchEngineService.save(selectedSearchEngine).then(function(data) {
            $modalInstance.modal('hide');

            $rootScope.$broadcast('refreshSearchEngine');
        });
    }
};
