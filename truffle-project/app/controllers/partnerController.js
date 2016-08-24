metaBc.controller('partnerController', function($scope, $routeParams, ngToast, accountsService, proxyService) {

    accountsService.getAccounts().then(function (accs) {
        $scope.accounts = accs;
    }, function(err) {
        ngToast.warn(err);
    });

    $scope.partnerId = $routeParams.id;

    $scope.buildProxy = function () {
        var partnerAccount = $scope.accounts[$scope.partnerId];
        var userAccount = $scope.userAccount;
        proxyService.buildProxy(partnerAccount, userAccount);
    }
});
