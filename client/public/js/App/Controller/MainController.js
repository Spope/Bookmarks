controllers.controller('MainController', ['$scope', 'UserService', 'modalService', function ($scope, UserService, modalService) {
    
    $scope.user = UserService.user;


    $scope.editSettings = function(){

        var template = 'js/App/View/Bookmarks/partial/Modal/editSettings.html';
        var title = 'Edit a folder';

        var modalDefault = {
            template: template,
            controller: UserSettingsController
        };

        modalService.showModal(modalDefault, {});
    }

}]);
