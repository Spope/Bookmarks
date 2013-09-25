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

    describe('SearchEngineService', function() {
        var searchEngineService;
        beforeEach(function() {
            module('bookmarkApp');
            inject(function($rootScope, $httpBackend, $http, $injector) {
                injector = $injector;

                rootScope   = $rootScope;
                httpMock    = $httpBackend;
                http        = $http;
            });
        });

        it('should retrieve the searchEngines', function() {

            httpMock.whenGET('/api/user/1/searchengines').respond(200, 
                [
                    {
                        "id": 1,
                        "name": "Google",
                        "url": "http://www.google.fr/search?q={q}",
                        "logo": "google.png"
                    },
                    {
                        "id": 2,
                        "name": "Amazon",
                        "url": "http://www.amazon.fr/s/ref=nb_sb_noss_1?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=search-alias%3Daps&field-keywords={q}",
                        "logo": "amazon.png"
                    }
            ]);
            var list;
            searchEngineService = injector.get('SearchEngineService', {Userservice : {user:{id:1}, isLogged:true}, $http: http});
            searchEngineService.get().then(function(data) {
                list = data.data;
            });

            //httpMock.expectGET('/api/user/1/searchengines');
            httpMock.flush();

            expect(list.length).toEqual(2);
        });
    });
});
