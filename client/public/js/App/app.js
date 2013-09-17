var app = angular.module('bookmark', ['ngResource']);


app.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'js/App/View/bookmarkList.html',
            controller: BookmarkListController
        }).
        when('/login', {
            templateUrl: 'js/App/View/login.html',
            controller: LoginController
        }).
        when('/logout', {
            templateUrl: 'js/App/View/login.html',
            controller: LogoutController
        }).
        otherwise({redirectTo: '/'});
});


app.config(['$httpProvider', function($httpProvider) {

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

app.factory('LoginService', function($resource) {
    return $resource('/api/login/');
});

app.factory('CategoryService', function($resource) {
    return $resource('/api/categories/');
});
