import "./ConsortiumRegistry.sol";

contract ConsortiumDB {

    // public address of creator
    address public createdBy;
    
    // the registry
    ConsortiumRegistry registry;

    // At time of writing enums are not implicitly convertible 
    // to an from uintXXX. Therefor no ENUM is used
    // Status: 
    //        0 - Unknown, Terminated
    //        1 - Prospect
    //        2 - Member

    // Member handling in struct, two maps (name and address) and the memberCount
    struct Member {
        string name;
        address addr;
        uint amount;
        uint total;
        uint status;
    }    
    
    mapping(address => Member)  members;
    mapping(string  => address) index;
    uint memberCount;    
    
    // Create instance of the consortium db and hard wire the address to the registry.
    // Add boot strapping member as first entry to members.
    function ConsortiumDB(address addr) {
        createdBy = msg.sender;
        registry = ConsortiumRegistry(addr);
        
        members[createdBy] = Member("metafinanz", msg.sender, 0, 0, 2);
        memberCount++;
        index["metafinanz"] = addr;
    }
    
    modifier onlyByAdminContract() {
        if (registry.getAddress("admin") != msg.sender)
            throw;
        _
    }
    
    modifier onlyByConsortiumRequest() {      
       if (registry.getAddress("consortiumrequest") != msg.sender)
            throw;
        _
    }
    
    modifier onlyByMint() {
        if (registry.getAddress("mint") != msg.sender)
            throw;
        _
    }
    
    modifier onlyByMember() {
        if (members[msg.sender].status == 0)
           throw;
        _
    }
    
    // Add a prospect to the db 
    function addProspect(string name, address addr, uint amount) onlyByAdminContract returns (mapping (string => address)) {
        if (index[name] != 0x0)
           throw;
        members[addr] = Member(name, addr, amount, 0, 1);
        memberCount++;
        index[name] = addr;
        return(index);
    }
    
    // Set member status 
    function setMember(address addr) onlyByConsortiumRequest {
        if (members[addr].status == 0)
           throw;
        if (members[addr].status == 1)
            members[addr].status = 2;
        else 
            throw;
    }
    
    // TODO: Considder Thilos estetics
    function setMinted(address addr) onlyByMint {
        if (members[addr].status == 0)
           throw;
        members[addr].total =+ members[addr].amount;
        members[addr].amount = 0;
    }
    
    // isConsortiumMember
    function isConsortiumMember(address addr) {
        if (members[addr].status != 2)
            throw;
    }

    // TEST ONLY
    function getCount() returns (uint count) {
        return (memberCount);
    }
}