touch contracts/*
truffle compile
truffle migrate --reset
truffle exec scripts/wire_contracts.js 
truffle exec scripts/init_blockchain.js 

