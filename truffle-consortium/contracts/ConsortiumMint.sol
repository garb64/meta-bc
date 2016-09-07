import "./ConsortiumRegistry.sol";

contract ConsortiumMint {

    // TODO: refactor into basis class
    modifier onlyByConsortiumDB() {
        if (registry.getAddress("cdb") != msg.sender)
            throw;
        _
    }

    // public address of creator
    address public createdBy;
    
    // the registry
    ConsortiumRegistry registry;
    
    // Instantiate ConsortiumMint
    function ConsortiumMint(address addr) {
        createdBy = msg.sender;
        registry = ConsortiumRegistry(addr);
    }
    
    // Create new account with given amount and owner addr.
    // Return address of account to consortium db to update
    // member record
    function startMint(address addr, uint amount) onlyByConsortiumDB returns (address account) {
        account = 0xaaaaaa;
        return (account);
    }
}