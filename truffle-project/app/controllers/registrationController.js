metaBc.controller('registrationController', ['$scope', 'proxyService', 'CONSTANTS', function($scope, proxyService, CONSTANTS) {

    $scope.buildProxy = function () {
        console.log("buildProxy", CONSTANTS.partner1, $scope.userAccount);
        proxyService.buildProxy(CONSTANTS.partner1, $scope.userAccount);
    }
}]);
