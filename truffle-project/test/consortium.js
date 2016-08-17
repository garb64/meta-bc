contract('Consortium', (accounts) => {

  var admin = accounts[0];
  var cp1 = accounts[1];
  var cp2 = accounts[2];
  var user1 = accounts[5];
  var user2 = accounts[6];

  var cp1Name = "Consortium Partner 1";

  describe("admin", () => {

    it("should store admin address", () => {
      var consortium = Consortium.deployed();

      return consortium.getAdminAddress.call().then((addr) => {
        assert.equal(addr, admin, "admin address not stored correctly");
      });
    });

    it("should recognize admin", () => {
      var consortium = Consortium.deployed();

      return consortium.isAdmin.call(admin).then((res) => {
        assert.isOk(res, "admin check failed");
      });
    });

    it("should reject others", () => {
      var consortium = Consortium.deployed();

      return consortium.isAdmin.call(cp1).then((res) => {
        assert.isNotOk(res, "admin check failed");
      });
    });
  });

  describe("consortium partner", () => {

    it("should add consortium partner", () => {
      var consortium = Consortium.deployed();

      return consortium.addPartner(cp1Name, cp1).then((tx_id) => {
        return consortium.getPartner.call(cp1).then((res) => {
          assert.equal(web3.toUtf8(res), cp1Name, "consortium partner not stored correctly");
        });
      });
    });

    it("should recognize consortium partner", () => {
      var consortium = Consortium.deployed();

      return consortium.addPartner(cp1Name, cp1).then((tx_id) => {
        return consortium.isPartner.call(cp1).then((res) => {
          assert.isOk(res, "partner check failed");
        });
      });
    });

    it("should reject others", () => {
      var consortium = Consortium.deployed();

      return consortium.isPartner.call(cp2).then((res) => {
        assert.isNotOk(res, "partner check failed");
      });
    });
  });

});
