// create the module and name it meta-bc
var metaBc = angular.module('metaBc', ['ngRoute', 'ngSanitize', 'ngToast']);

// configure our routes
metaBc.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'pages/main.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/user', {
            templateUrl : 'pages/user.html',
            controller  : 'userController'
        })

        // route for the contact page
        .when('/partner', {
            templateUrl : 'pages/partner.html',
            controller  : 'partnerController'
        });
});

metaBc.controller('mainController', function($scope, ngToast) {

    web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
            ngToast.warning ("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            ngToast.warning ("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }
        $scope.accounts = accs;
    });

});

metaBc.controller('userController', function($scope) {
    $scope.message = 'Look! I am a user page.';
});

metaBc.controller('partnerController', function($scope, $routeParams, ngToast) {
    $scope.partnerId = $routeParams.id;

    $scope.buildProxy = function () {
        ngToast.info("build Proxy for " + $scope.userAccount);
    }
});
