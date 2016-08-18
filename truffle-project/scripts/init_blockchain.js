module.exports = function(callback) {
    var registry = Registry.deployed();

    // add consortium member
    registry.getContractAddress.call("consortium").then((cons) => {
        
    });

    // set registry address in registry aware contracts
};