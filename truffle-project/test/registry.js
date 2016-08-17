contract('Registry', (accounts) => {

  it("should set contract addresses", () => {
    var registry = Registry.deployed();

    return registry.addContract("registry", registry.address).then((tx_id) => {
      return registry.getContractAddress.call("registry");
    }).then((res) => {
      assert.equal(res, registry.address, "address not stored correctly");
    });
  });
});
