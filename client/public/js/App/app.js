bookmarkApp.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'js/App/View/bookmarkList.html',
            controller: 'BookmarkListController',
            access: {
                level: 1
            }
        }).
        when('/test', {
            templateUrl: 'js/App/View/bookmarkList.html',
            controller: 'BookmarkListController',
            access: {
                level: 2
            }
        }).
        when('/login', {
            templateUrl: 'js/App/View/login.html',
            controller: 'LoginController',
            access: {
                level: 0
            }
            
        }).
        when('/logout', {
            templateUrl: 'js/App/View/login.html',
            controller: 'LogoutController',
            access: {
                level: 0
            }
        }).
        otherwise({redirectTo: '/'});
});

//Check user auth
bookmarkApp.run(['$rootScope', 'AuthService', 'UserService', '$location', function(root, auth, User, location) {
    root.$on('$routeChangeSuccess', function(scope, currView, prevView) { 
        if (!auth.checkAuth(currView, User.user)){
            var page = location.path();
            location.path('/login').search({redirect: page});
        }
    });
}]);


bookmarkApp.config(['$httpProvider', function($httpProvider) {

    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.responseInterceptors.push(function($q, $location) {
        return function(promise) {
            return promise.then(
                // Success: just return the response
                function(response){
                    return response;
                }, 
                // Error: check the error status to get only the 401
                function(response) {
                    if (response.status === 401 && $location.path() != '/login')
                        $location.url('/login');
                    return $q.reject(response);
                }
            );
        }
    });

}]);
