var services     = angular.module('bookmarkApp.services', []);
var directives   = angular.module('bookmarkApp.directives', []);
var filters      = angular.module('bookmarkApp.filters', []);
var controllers  = angular.module('bookmarkApp.controllers', []);

var cacheModule = angular.module('bookmarkApp.cacheData',[]);


var bookmarkApp = angular.module('bookmarkApp', ['bookmarkApp.directives', 'bookmarkApp.controllers','bookmarkApp.services','bookmarkApp.filters', 'bookmarkApp.cacheData']);

cacheModule.factory('resourceCache',['$cacheFactory', function($cacheFactory) { 
    return $cacheFactory('resourceCache'); 
}]);
