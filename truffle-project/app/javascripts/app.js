var accounts;
var account;
var userAccount;

function watchProxiesBuilt() {

  var proxyFactory = ProxyFactory.deployed();
  var event = proxyFactory.ProxyBuilt().watch(function(error, result){
    if (!error){
      var a = result.args.account;
      var p = result.args.proxyAddress;
      setResult(p);
    }
    else console.log(error);
  });

}

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function setResult(addr) {
  var status = document.getElementById("result");
  status.innerHTML = addr;
}

function buildProxy() {
  var partnerAccount = accounts[1];
  var userAccount = accounts[3];
  var registry = Registry.deployed();
  registry.getContractAddress.call("proxyFactory").then(function(addr) {
    var proxyFactory = ProxyFactory.at(addr);
    setStatus("Initiating transaction... (please wait)");
    proxyFactory.buildProxy.sendTransaction(userAccount, {from: partnerAccount}).then(function() {
      setStatus("Transaction complete!");
    }).catch(function(e) {
      console.log(e);
      setStatus("Error building proxy; see log.");
    });
  });
}

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

    watchProxiesBuilt();
  });
};
