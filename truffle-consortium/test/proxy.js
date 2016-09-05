contract('ConsortiumFactory', function(accounts) {
    
  var registry;
  var admin;
  var cdb;
    
  before("prepare registry", function() {
      registry = ConsortiumRegistry.deployed();
      cdb = ConsortiumDB.deployed();
      mint = ConsortiumMint.deployed();
      factory = ConsortiumFactory.deployed();
          
      registry.setAddress("cdb", cdb.address);
      registry.setAddress("admin", admin.address);
      registry.setAddress("mint", mint.address);
      registry.setAddress("factory", factory.address);
      
  }); 

  it("create a valid new member request", function() {
      return factory.newConsortiumRequest("alex", 0x123, 100, {from:accounts[0]}).then(function() {
          return cdb.getAddress.call(0x123).then(function(name) {
              assert.equal(name, "alex", "Alex was not found in cdb at 0x123");
          });
      });
  });
    
  it("create a new member request and retrieve wrong address", function() {
      return admin.addProspectRequest("thilo", 0x124, 100, {from:accounts[0]}).then(function() {
          return cdb.getAddress.call(0x125).then(function(name) {
              assert.equal(name, "thilo", "Thilo was not found in cdb at 0x124");
          });
      });
  });
});