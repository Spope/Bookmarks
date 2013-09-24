var httpMock;

var controller, http, olocation, userService;



describe('Controller', function() {
    describe('LoginController', function(){

        var $scope = {
            user: {login: "", password:"", remember:false}
        };
        var lc;

        beforeEach(function(){
            module('bookmarkApp');
            inject(function($rootScope, $controller, $httpBackend, $http, $location, UserService){
                rootScope   = $rootScope;
                httpMock    = $httpBackend;
                controller  = $controller;
                http        = $http;
                olocation   = $location;
                userService = UserService;

            });

            //Before the login, the location is /login
            olocation.path('/login');
            rootScope.$apply();
        });

        it('should try to login the user with session on load', function(){

            httpMock.whenPOST('/api/login').respond(401, {"error": true});
            httpMock.expectPOST('/api/login');
            lc = controller('LoginController', {$scope: $scope, $http: http, $location: olocation, UserService: userService});
            httpMock.flush();

            expect($scope.loginError).toEqual(false);
            expect(userService.isLogged).toEqual(false);
            expect(userService.user).toBeNull();
        });

        it('should set the loginError to true', function(){

            httpMock.whenPOST('/api/login').respond(401, {"error": true});
            httpMock.expectPOST('/api/login');
            lc = controller('LoginController', {$scope: $scope, $http: http, $location: olocation, UserService: userService});
            httpMock.flush();

            $scope.user.login = 'aa';
            $scope.user.password = 'aa';
            //Creation of a login error
            httpMock.whenPOST('/api/login').respond(401, {"error": true});
            httpMock.expectPOST('/api/login');
            $scope.loginFn(false);
            httpMock.flush();
            //
            expect($scope.loginError).toEqual(true);
            expect(userService.isLogged).toEqual(false);
            expect(userService.user).toBeNull();

        });

        it('should log the user', function(){
            //
            httpMock.whenPOST('/api/login').respond(200, {
                    "id": 1,
                    "username": "Spope",
                    "password": "xxxxx",
                    "token": "xxxx",
                    "email": "address@mail.com",
                    "roles": "1"
                }
            );
            httpMock.expectPOST('/api/login');
            lc = controller('LoginController', {$scope: $scope, $http: http, $location: olocation, UserService: userService});
            httpMock.flush();

            expect(userService.isLogged).toEqual(true);
            expect(userService.user.id).toEqual(1);

            //after login, location has been redirected to /
            expect(olocation.path()).toBe("/");
        });
    });
});
