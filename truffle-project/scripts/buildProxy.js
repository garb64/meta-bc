var userAddress = process.argv[4];

module.exports = (callback) => {
    var registry = Registry.deployed();

    registry.getContractAddress.call("proxyFactory").then((pf) => {
        var proxyFactory = ProxyFactory.at(pf);
        var log = proxyFactory.ProxyBuilt();
        proxyFactory.buildProxy(userAddress, {from: '0x2f9233188c82fc603469f8ebc7edd0803a12d17d'}).then((tx) => {
            log.watch((error, event) => { console.log(event.args); log.stopWatching(); });
        });
    });
};
