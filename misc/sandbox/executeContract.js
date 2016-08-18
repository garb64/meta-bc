var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3();

var contractName = process.argv[2];
var address = process.argv[3];
var interface = fs.readFileSync(`./abis/${contractName}.abi`).toString();
var abi = JSON.parse(interface);

web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

var MyContract = web3.eth.contract(abi);
var contract = MyContract.at(address);
var result = null;
switch(contractName) {
    case "test":
        result = contract.multiply.call(10);
        break;
    case "Hello":
        result = contract.sayHi.call();
        break;
    default:
    console.error(`method unknown for contract: ${contractName}`);
}
result && console.log(result);
