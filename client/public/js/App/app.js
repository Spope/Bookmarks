bookmarkApp.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'js/App/View/bookmarkList.html',
            controller: controllers.BookmarkListController,
            access: {
                level: 1
            }
        }).
        when('/login', {
            templateUrl: 'js/App/View/login.html',
            controller: controllers.LoginController,
            access: {
                level: 0
            }
            
        }).
        when('/logout', {
            templateUrl: 'js/App/View/login.html',
            controller: controllers.LogoutController,
            access: {
                level: 1
            }
        }).
        otherwise({redirectTo: '/'});
});


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
                    if (response.status === 401)
                        $location.url('/login');
                    return $q.reject(response);
                }
            );
        }
    });

}]);
