module.exports = (callback) => {
    var accounts = web3.eth.accounts;
    var admin = accounts[0];
    var cp1 = accounts[1];
    var registry = Registry.deployed();

    // add consortium member
    registry.getContractAddress.call("consortium").then((cons) => {
        consortium = Consortium.at(cons);
        consortium.addPartner("Consortium Partner 1", cp1);
    });
};