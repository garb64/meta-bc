module.exports = function(deployer) {
  deployer.deploy(ConsortiumRegistry)
    .then(function() {  
       return deployer.deploy(ConsortiumDB, ConsortiumRegistry.address);  
    }).then(function() {
       return deployer.deploy(ConsortiumFactory, ConsortiumRegistry.address);
    }).then(function() {
       return deployer.deploy(ConsortiumRequest, ConsortiumRegistry.address);
    }).then(function() {
       return deployer.deploy(ConsortiumMint, ConsortiumRegistry.address);
    });
};
