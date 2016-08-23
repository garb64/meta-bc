metaBc.factory('proxyService', ['$rootScope', function($rootScope) {

    function watchProxiesBuilt() {
        var proxyFactory = ProxyFactory.deployed();
        var event = proxyFactory.ProxyBuilt().watch(function(error, result){
            if (!error){
                var a = result.args.account;
                var p = result.args.proxyAddress;
                $rootScope.$broadcast('ProxyBuilt', {a: a, p: p});
            }
            else console.log(error);
        });
    }

    watchProxiesBuilt();

    return {
        buildProxy: function (partnerAccount, userAccount) {
            var registry = Registry.deployed();
            registry.getContractAddress.call("proxyFactory").then(function(addr) {
                var proxyFactory = ProxyFactory.at(addr);
                return  proxyFactory.buildProxy.sendTransaction(userAccount, {from: partnerAccount}).then(function() {
                    return;
                }).catch(function(e) {
                    console.log(e);
                    console.log("Error building proxy; see log.");
                });
            });

        }
    };

}]);