metaBc.factory('proxyService', ['$rootScope', '$q', function($rootScope, $q) {

    var deferObject;

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
        },

        getContractAddress: function (proxyAddress, contractName) {
            var defer = $q.defer();
            var proxy = Proxy.at(proxyAddress);
            proxy.getContractAddress.call(contractName).then(function (addr) {
                defer.resolve(addr);
            });
            return defer.promise;
        },

        addContract: function (userAccount, proxyAddress, contractName) {
            var defer = $q.defer();
            var proxy = Proxy.at(proxyAddress);
            proxy.initContract.sendTransaction(contractName, {from: userAccount}).then(function (tx_id) {
               return proxy.getContractAddress.call(contractName).then(function (addr) {
                   console.log('contract created at: ' + addr);
                   defer.resolve(addr);
               })
            });
            return defer.promise;
        },

    };

}]);