cacheModule.directive('preloadResource', ['resourceCache', function(resourceCache) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) { 
            resourceCache.put(attrs.preloadResource, element.html()); 
        }
    };
}]);
