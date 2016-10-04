var userAddress = process.argv[4];
var partnerAddress = process.argv[5];

function logResult(event) {
    console.log(`{"userAccount":"${event.account}","proxyAddress":"${event.proxyAddress}"}`);
}

module.exports = (callback) => {
    var registry = Registry.deployed();

    registry.getContractAddress.call("proxyFactory").then((pf) => {
        var proxyFactory = ProxyFactory.at(pf);
        var log = proxyFactory.ProxyBuilt();
        proxyFactory.buildProxy(userAddress, {from: partnerAddress}).then((tx) => {
            log.watch((error, event) => { logResult(event.args); log.stopWatching(); });
        });
    });
};
