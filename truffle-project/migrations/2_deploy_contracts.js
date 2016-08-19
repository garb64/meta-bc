module.exports = function(deployer) {
  deployer.deploy(Contact);
  deployer.deploy(ContractFactory);
  deployer.deploy(Registry);
  deployer.deploy(ProxyFactory);
  deployer.deploy(ProxyFactoryTest);
  deployer.deploy(Consortium);
};
