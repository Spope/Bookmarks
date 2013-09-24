var mock;

var userService,
    authService;

describe('Services', function() {
    
    describe('UserService', function() {

        beforeEach(function() {
            module('bookmarkApp');
            inject(function($injector) {
                userService = $injector.get('UserService');
            });
        });

        it('should create the UserService object', function() {

            expect(userService.isLogged).toEqual(false);
            expect(userService.user).toBeNull();
        });
    });

    describe('AuthService', function() {

        beforeEach(function() {
            module('bookmarkApp');
            inject(function($injector) {
                authService = $injector.get('AuthService');
            });
        });

        it('should create the check route auth', function() {

            var route = {access: {level: 0}};
            var user  = undefined;
            expect(authService.checkAuth(route, user).response).toEqual(true);

            route = {access: {level: 1}};
            user  = undefined;
            expect(authService.checkAuth(route, user).response).toEqual(false);
            expect(authService.checkAuth(route, user).redirect).toEqual(true);

            route = {access: {level: 1}};
            user  = {roles: 1};
            expect(authService.checkAuth(route, user).response).toEqual(true);

            route = {access: {level: 2}};
            user  = {roles: 1};
            expect(authService.checkAuth(route, user).response).toEqual(false);
            expect(authService.checkAuth(route, user).redirect).toEqual(false);
        });
    });
});
