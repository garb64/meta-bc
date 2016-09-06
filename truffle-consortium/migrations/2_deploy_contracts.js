module.exports = function(deployer) {
  deployer.deploy(ConsortiumRegistry)
    .then(function() {  
       return deployer.deploy(ConsortiumDB, ConsortiumRegistry.address);  
    }).then(function() {
       return deployer.deploy(ConsortiumRequestHandler, ConsortiumRegistry.address);
    }).then(function() {
       return deployer.deploy(ConsortiumMint, ConsortiumRegistry.address);
    });
};
