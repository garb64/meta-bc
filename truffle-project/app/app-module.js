// create the module and name it meta-bc
var metaBc = angular.module('metaBc', ['ngRoute', 'ngSanitize', 'ngToast', 'ui.grid']);

// configure our routes
metaBc.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'views/main.html',
            controller  : 'mainController'
        }).when('/user', {
            templateUrl : 'views/user.html',
            controller  : 'userController'
        }).when('/partner', {
            templateUrl : 'views/partner.html',
            controller  : 'partnerController'
        });
});

