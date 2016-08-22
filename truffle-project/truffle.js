module.exports = {
  build: {
    "index.html": "index.html",
    "pages/": "pages/",
    "app.js": [
      "javascripts/angular.min.js",
      "javascripts/angular-route.min.js",
      "javascripts/angular-sanitize.min.js",
      "javascripts/jquery-3.1.0.slim.min.js",
      "external/bootstrap-3.3.7-dist/js/bootstrap.min.js",
      "external/ngToast/ngToast.min.js",
      "javascripts/app.js",
      "javascripts/controller/script.js"
    ],
    "app.css": [
      "external/bootstrap-3.3.7-dist/css/bootstrap.min.css",
      "external/font-awesome-4.6.3/css/font-awesome.min.css",
      "external/ngToast/ngToast-animations.min.css",
      "external/ngToast/ngToast.min.css"
    ],
    "images/": "images/",
    "fonts/": "external/font-awesome-4.6.3/fonts/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
