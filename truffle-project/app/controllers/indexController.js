metaBc.controller('indexController', function($scope, ngToast, accountsService) {

    $scope.proxies = ['', '', '', '', '', '', '','', '', ''];

    accountsService.getAccounts().then(function (accs) {
        $scope.accounts = accs;
    }, function(err) {
        ngToast.warn(err);
    });

    $scope.$on('ProxyBuilt', function(event, res) {
        angular.forEach($scope.accounts, function(a, i) {
            if ($scope.accounts[i] == res.a) $scope.proxies[i] = res.p;
        });
    });

});

