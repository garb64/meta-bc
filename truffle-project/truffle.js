module.exports = {
    build: {
        "index.html": "index.html",
        "views/": "views/",
        "app.js": [
            "external/angularjs-1.5.8/angular.min.js",
            "external/angularjs-1.5.8/angular-route.min.js",
            "external/angularjs-1.5.8/angular-sanitize.min.js",
            "external/jquery-3.1.0/jquery-3.1.0.slim.min.js",
            "external/bootstrap-3.3.7-dist/js/bootstrap.min.js",
            "external/ngToast/ngToast.min.js",
            "external/ui-grid-3.2.6/ui-grid.min.js",
            "app-module.js",
            "controllers/indexController.js",
            "controllers/mainController.js",
            "controllers/partnerController.js",
            "controllers/userController.js",
            "controllers/logController.js",
            "services/accountsService.js",
            "services/contactService.js",
            "services/proxyService.js",
            "services/logService.js"
        ],
        "app.css": [
            "external/bootstrap-3.3.7-dist/css/bootstrap.min.css",
            "external/font-awesome-4.6.3/css/font-awesome.min.css",
            "external/ngToast/ngToast-animations.min.css",
            "external/ngToast/ngToast.min.css",
            "external/ui-grid-3.2.6/ui-grid.min.css"
        ],
        "images/": "images/",
        "fonts/": "external/fonts/"
    },
    rpc: {
        host: "localhost",
        port: 8545
    }
};
