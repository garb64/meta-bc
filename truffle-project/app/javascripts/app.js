var accounts;
var account;
var userAccount;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function buildProxy() {
  var proxyFactory = ProxyFactory.deployed();
  var partnerAccount = accounts[1];
  var userAccount = accounts[3];
  console.log("Initiating transaction... (please wait)");
  proxyFactory.buildProxy.sendTransaction({from: partnerAccount}).then(function() {
    console.log("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    console.log("Error building proxy; see log.");
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
  });
};
