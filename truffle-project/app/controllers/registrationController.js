metaBc.controller('registerController', function($scope, proxyService) {

    $scope.buildProxy = function () {
        var partnerAccount = $scope.accounts[$scope.partnerId];
        var userAccount = $scope.userAccount;
        proxyService.buildProxy(partnerAccount, userAccount);
    }
});
