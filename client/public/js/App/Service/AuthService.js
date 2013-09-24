services.factory('AuthService', [function() {
    sdo = {
        checkAuth: function(route, user) {
            if(!route.access){
                //first page load redirect to the #/
                return true;
            }
            if ((route.access && route.access.level > 0) && !user) {
                //This route need the user to be logged
                return {response: false, redirect: true};
            }
            if (route.access.level > 0 && (!user || user.roles < route.access.level)) {
                //Role error
                return {response: false, redirect: false};
            }

            return {response: true};
        }
    }

    return sdo;
}]);
