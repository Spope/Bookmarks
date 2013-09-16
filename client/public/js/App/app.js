angular.module('bookmark', []).
    config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'js/App/View/login.html',
            controller: LoginController
        }).
        when('/', {
            templateUrl: 'js/App/View/bookmarkList.html',
            controller: BookmarkListController
        }).
        otherwise({redirectTo: '/'});
}]);
