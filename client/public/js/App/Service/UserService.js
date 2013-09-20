services.factory('UserService', [function() {
    var sdo = {
        isLogged: false,
        user: null
    }

    return sdo;
}]);

services.factory('AuthService', [function() {
    sdo = {
        checkAuth: function(route, user) {
            if (!route.access || (route.access.level > 0 && (!user || user.role < route.access.level))) {
                return false;
            }

            return true;
        }
    }

    return sdo;
}]);
