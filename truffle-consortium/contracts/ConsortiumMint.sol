import "./ConsortiumRegistry.sol";

contract ConsortiumMint {

    // public address of creator
    address public createdBy;
    
    // the registry
    ConsortiumRegistry registry;
    
    // Instantiate ConsortiumMint
    function ConsortiumMint(address addr) {
        createdBy = msg.sender;
        registry = ConsortiumRegistry(addr);
    }
}