angular.module('bookmark', []).
    config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'public/js/App/View/login.html',
            controller: LoginController
        }).
        when('/', {
            templateUrl: 'public/js/App/View/bookmarkList.html',
            controller: BookmarkListController
        }).
        otherwise({redirectTo: '/'});
}]);
