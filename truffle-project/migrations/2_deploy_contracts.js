module.exports = function(deployer) {
  deployer.deploy(ContractFactory);
  deployer.deploy(Registry);
  deployer.deploy(ProxyFactory);
  deployer.deploy(Consortium);
  deployer.deploy(Logger);
};
