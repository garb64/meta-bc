contract('ConsortiumFactory', function(accounts) {
    
  var registry;
  var admin;
  var cdb;
    
  before("prepare registry", function() {
      registry = ConsortiumRegistry.deployed();
      cdb = ConsortiumDB.deployed();
      mint = ConsortiumMint.deployed();
      handler = ConsortiumRequestHandler.deployed();
    
      registry.setAddress("cdb", cdb.address);
      registry.setAddress("mint", mint.address);
      registry.setAddress("handler", handler.address);
      
  });
    
  it("name a new prospect", function() {
      return handler.nameProspect("test1", 0x123, 100, {from:accounts[0]}).then(function() {
        caught = 0;
      }).catch(function() {
        caught = 1;
      }).then(function() {
        assert.equal(0, caught, "Did not throw (an error occured)");
      });
  });
    
  it("name annother new prospect", function() {
      return handler.nameProspect("test2", 0x12345, 100, {from:accounts[0]}).then(function() {
        caught = 0;
      }).catch(function() {
        caught = 1;
      }).then(function() {
        assert.equal(0, caught, "Did not throw (an error occured)");
      });
  });
  
  it("name a new prospect for the second time", function() {
      return handler.nameProspect("test1", 0x123, 100, {from:accounts[0]}).then(function() {
        caught = 0;
      }).catch(function() {
        caught = 1;
      }).then(function() {
        assert.equal(1, caught, "Did not throw (an error occured)");
      });
  });
    
  it("verify new prospect is prospect", function() {
      return cdb.isConsortiumProspect(0x123).then(function() {
        caught = 0;
      }).catch(function() {
        caught = 1;
      }).then(function() {
        assert.equal(0, caught, "Did not throw (an error occured)");
      });
  });
  
  it("verify new prospect is NOT member", function() {
      return cdb.isConsortiumMember(0x123).then(function() {
        caught = 0;
      }).catch(function() {
        caught = 1;
      }).then(function() {
        assert.equal(1, caught, "Did not throw (an error occured)");
      });
  });
    
  it("name a new prospect with wrong msg.sender address", function() {
      return handler.nameProspect("thilo", 0x124, 100, {from:accounts[1]}).then(function() {
        caught = 0;
      }).catch(function() {
        caught = 1;
      }).then(function() {
        assert.equal(1, caught, "Did not throw (an error occured)");
      });
  });
    
  it("count open prospects", function() {
      return cdb.getProspectCount.call().then(function(rs) {
        assert.equal(2, rs, "Wrong count");
      });
  });
    
  
});