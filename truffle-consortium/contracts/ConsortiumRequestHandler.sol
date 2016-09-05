import "./ConsortiumRegistry.sol";
import "./ConsortiumDB.sol";

contract ConsortiumRequestHandler {

    // public address of creator
    address public createdBy;
    
    // the registry
    ConsortiumRegistry registry;

    // Member handling in struct, two maps (name and address) and the memberCount
    struct Request {
        uint requestType; 
        string name;
        address addr;
        uint amount;
        uint total;
        mapping (string => address) quorum;
    } 
    
    mapping(address => Request) requests;
    mapping(string  => address) index;
    uint indexCount; 
    
    // Instantiate ConsortiumRequestHandler
    function ConsortiumRequestHandler(address addr) {
        createdBy = msg.sender;
        registry = ConsortiumRegistry(addr);
    }
    
    // accept prospect requests from existing members
    function nameProspect(string name, address addr, uint amount) {
        ConsortiumDB cdb = ConsortiumDB(registry.getAddress("cdb"));
        address[] quorum = cdb.addProspect(name, addr, amount);
    } 
}