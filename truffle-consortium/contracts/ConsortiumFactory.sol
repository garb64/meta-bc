import "./ConsortiumRegistry.sol";

contract ConsortiumFactory {

    // public address of creator
    address public createdBy;
    
    // the registry
    ConsortiumRegistry registry;
    
    // Instantiate ConsortiumFactory
    function ConsortiumFactory(address addr) {
        createdBy = msg.sender;
        registry = ConsortiumRegistry(addr);
    }
    
}