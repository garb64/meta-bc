module.exports = function(deployer) {
  deployer.deploy(Contact);
  deployer.deploy(ContractFactory);
  deployer.deploy(ContractFactoryTest);
  deployer.deploy(Registry);
  deployer.deploy(Proxy);
  deployer.deploy(ProxyFactory);
  deployer.deploy(ProxyFactoryTest);
  deployer.deploy(Consortium);
};
