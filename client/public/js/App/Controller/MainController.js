controllers.controller('MainController', ['$scope', 'modalService',function ($scope, modalService) {
    var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Delete Customer',
        headerText: 'Delete ?',
        bodyText: 'Are you sure you want to delete this customer?'
    };

    modalService.showModal({}, modalOptions);

}]);
