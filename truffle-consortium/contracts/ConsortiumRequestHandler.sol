import "./ConsortiumRegistry.sol";
import "./ConsortiumDB.sol";

/*


Not sure if we need the requeshandler - it's best described as a proxy object 

*/
contract ConsortiumRequestHandler {

    // public address of creator
    address public createdBy;
    
    // the registry
    ConsortiumRegistry registry;

    // Member handling in struct, two maps (name and address) and the memberCount
    struct Request {
        uint requestType; /* newMember or mint */ 
        string name;
        address addr;
        uint amount;
        uint total;
    } 
    
    mapping(address => Request) requests;
    mapping(string  => address) index;
    uint indexCount;
    
    // Instantiate ConsortiumRequestHandler
    function ConsortiumRequestHandler(address addr) {
        createdBy = msg.sender;
        registry = ConsortiumRegistry(addr);
    }
    
    // only accept prospect requests from existing members
    function nameProspect(string name, address addr, uint amount) {
        ConsortiumDB cdb = ConsortiumDB(registry.getAddress("cdb"));
        cdb.isConsortiumMember(msg.sender);
        cdb.addProspect(name, addr, amount);
    } 
    
    // olny accept prospect approvals from existing members
    function approveProspect(address addr) {
        ConsortiumDB cdb = ConsortiumDB(registry.getAddress("cdb"));
        cdb.isConsortiumMember(msg.sender);
        cdb.approveProspect(addr, msg.sender);
    }
    
    // olny accept prospect approvals from existing members
    function mintRequest(uint amount) {
        ConsortiumDB cdb = ConsortiumDB(registry.getAddress("cdb"));
        cdb.isConsortiumMember(msg.sender);
        cdb.addMintRequest(amount, msg.sender);
    }
    
    
}