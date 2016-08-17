// The Registry contract.
contract Registry {

    address owner;

    // This is where we keep all the contracts.
    mapping (bytes32 => address) public contracts;

    modifier onlyOwner { //a modifier to reduce code replication
        if (msg.sender == owner) // this ensures that only the owner can access the function
            _
    }
    // Constructor
    function Registry(){
        owner = msg.sender;
    }

    // Add a new contract to Registry. This will overwrite an existing contract.
    function addContract(bytes32 name, address addr) onlyOwner returns (bool result) {
        contracts[name] = addr;
        return true;
    }

    function getContractAddress(bytes32 name) returns (address addr) {
        return contracts[name];
    }

    // Remove a contract from Registry. We could also selfdestruct if we want to.
    function removeContract(bytes32 name) onlyOwner returns (bool result) {
        if (contracts[name] == 0x0){
            return false;
        }
        contracts[name] = 0x0;
        return true;
    }

    function remove() onlyOwner {
        //address fm = contracts["fundmanager"];
        //address perms = contracts["perms"];
        //address permsdb = contracts["permsdb"];
        //address bank = contracts["bank"];
        //address bankdb = contracts["bankdb"];

        // Remove everything.
        //if(fm != 0x0){ RegistryEnabled(fm).remove(); }
        //if(perms != 0x0){ RegistryEnabled(perms).remove(); }
        //if(permsdb != 0x0){ RegistryEnabled(permsdb).remove(); }
        //if(bank != 0x0){ RegistryEnabled(bank).remove(); }
        //if(bankdb != 0x0){ RegistryEnabled(bankdb).remove(); }

        // Finally, remove Registry. Registry will now have all the funds of the other contracts,
        // and when suiciding it will all go to the owner.
        selfdestruct(owner);
    }

}
