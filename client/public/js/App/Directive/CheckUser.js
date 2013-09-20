directives.directive('checkUser', ['$rootScope', '$location', 'UserService', function($rootScope, $location, UserService){

    return {
        link: function(scope, element, attrs) {

            $rootScope.$on('$routeChangeStart', function(event, current, pervious){

                if (previous.access.level > 0 && (!UserService.isLogged || UserService.User.role < previous.access.level)) {
                    $location.path('/login');
                }
            });
        }
    }
}]);
