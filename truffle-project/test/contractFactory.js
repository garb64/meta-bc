contract('ContractFactory', (accounts) => {

  it("should build contact contracts", () => {
    var contractFactory = ContractFactory.deployed();
    var contractFactoryTest = ContractFactoryTest.deployed();

    return contractFactoryTest.buildContract(contractFactory.address, "contact").then((tx_id) => {
      return contractFactoryTest.getContractAddress.call("contact").then((addr) => {
        contact = Contact.at(addr);
        return contact.isA.call().then((t) => {
          assert.equal(t, "contact", "contract factory did not build a contact");
        });
      });
    });
  });

});
