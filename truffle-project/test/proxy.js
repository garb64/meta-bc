contract('Proxy', (accounts) => {

  it("should be registry aware", () => {
    var proxy = Proxy.deployed();
    var registry = Registry.deployed();

    return proxy.setRegistryAddress(registry.address).then((tx_id) => {
      return proxy.getRegistryAddress.call().then((addr) => {
        assert.equal(addr, registry.address, "proxy is not registry aware");
      });
    });
  });

  it("should build a contact contract", () => {
    var proxy = Proxy.deployed();
    var registry = Registry.deployed();
    var contractFactory = ContractFactory.deployed();

    return registry.addContract("contractFactory", contractFactory.address).then((tx_id) => {
      return proxy.setRegistryAddress(registry.address).then((tx_id) => {
        return proxy.initContact().then((tx_id) => {
          return proxy.getContactAddress.call().then((addr) => {
            return Contact.at(addr).isA.call().then((res) => {
              assert.equal(res, "contact", "proxy does not build contact contracts");
            });
          });
        });
      });
    });
  });

});
