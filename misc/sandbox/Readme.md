# Solidity Sandbox

## Preparation

install node modules with `npm install`.  
start a blockchain client, like `testrpc`.

## Deploy contract

deploy contracts in `./contracts` with `node createContract.js contractName`, e.g.

    node createContract.js Hello

This will compile the contract, store the abi in `abi/` for later reference and deploy the contract to the blockchain.
It returns a line with contract name and address.

NB: the contract name in the solidity file needs to have exactly the same name as the solidity file.

## Test contract method

Use `node executeContract.js contractName contractAddress` to call a contract method. Example:

    node executeContract.js Hello 0x8ae42b4c7645de47b2360c17fbc436b15189a339

for contractName and contractAddress you can simply copy the output of `createContract.js`.

NB: for new contracts, the call of the tests method must be configured in the script.