module.exports = function(callback) {
    // perform actions
    var registry = Registry.deployed();

    // register contracts in registry
    registry.addContract("contractFactory", ContractFactory.deployed().address);
    registry.addContract("proxyFactory", ProxyFactory.deployed().address);
    registry.addContract("consortium", Consortium.deployed().address);
    registry.addContract("logger", Logger.deployed().address);

    // set registry address in registry aware contracts
    ProxyFactory.deployed().setRegistryAddress(registry.address);
    ContractFactory.deployed().setRegistryAddress(registry.address);
};