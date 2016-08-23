contract('ContractFactory', (accounts) => {

  it("should build contact contracts", () => {
    var contractFactory = ContractFactory.deployed();

    ContractFactoryTest.new().then((cft) => {
      return cft.buildContract(contractFactory.address, "contact").then((tx_id) => {
        return contractFactoryTest.getContractAddress.call("contact").then((addr) => {
          var contact = Contact.at(addr);
          return contact.contractType.call().then((t) => {
            assert.equal(t, "contact", "contract factory did not build a contact");
          });
        });
      });
    });
  });

});
