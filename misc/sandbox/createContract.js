var fs = require('fs');
var solc = require('solc');
var Web3 = require('web3');
var web3 = new Web3();

var contractName = process.argv[2];

web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

// solidity code code
var source = fs.readFileSync(`./contracts/${contractName}.sol`).toString();
var output = solc.compile(source, 1); // 1 activates the optimiser
var code = output.contracts[contractName].bytecode;
var abi = JSON.parse(output.contracts[contractName].interface);
var myContract;


fs.writeFile(`./abis/${contractName}.abi`, JSON.stringify(abi), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log(`abi written to ./abis/${contractName}.abi`);
});

function createExampleContract() {
    // let's assume that coinbase is our account
    web3.eth.defaultAccount = web3.eth.coinbase;

    // create contract
    console.log("transaction sent, waiting for confirmation");
    web3.eth.contract(abi).new({data: code}, (err, contract) => {
        if(err) {
            console.error(err);
            // callback fires twice, we only want the second call when the contract is deployed
        } else if(contract.address){
            console.log(contractName + ' ' + contract.address);
        }
    });
}

var myContractReturned = createExampleContract();
