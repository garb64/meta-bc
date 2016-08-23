// create the module and name it meta-bc
var metaBc = angular.module('metaBc', ['ngRoute', 'ngSanitize', 'ngToast']);

// configure our routes
metaBc.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'views/main.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/user', {
            templateUrl : 'views/user.html',
            controller  : 'userController'
        })

        // route for the contact page
        .when('/partner', {
            templateUrl : 'views/partner.html',
            controller  : 'partnerController'
        });
});

