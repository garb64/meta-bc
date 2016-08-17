module.exports = function(callback) {
    // perform actions
    var registry = Registry.deployed();
    var contractFactoryAddress = ContractFactory.deployed().address;

    // register factories in registry
    registry.addContract("contractFactory", contractFactoryAddress);

    // set registry address in registry aware contracts
    Proxy.deployed().setRegistryAddress(registry.address);
}