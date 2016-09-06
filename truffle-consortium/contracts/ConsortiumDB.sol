import "./ConsortiumRegistry.sol";


/*
 TODO: 
    Is name in member really needed?
    
    Do new member request have to be serialized?
*/

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

    // Member handling in struct, two maps (count and address) and the count
    struct Member {
        string name;  // Name might not be needed
        address addr;
        uint amount;
        uint total;
        uint status;
        uint quorum;
        uint signatureCount;
        mapping (uint => address) signingMembers;
    }    
    
    mapping(address => Member)  members;
    mapping(uint  => address) index;
    uint count;
    
    
    // Create instance of the consortium db and hard wire the address to the registry.
    // Add boot strapping member as first entry to members.
    function ConsortiumDB(address addr) {
        createdBy = msg.sender;
        registry = ConsortiumRegistry(addr);
        
        members[createdBy] = Member({name:"metafinanz", addr:msg.sender, amount:0, total:0, status:2, quorum:1, signatureCount:1});
        members[createdBy].signingMembers[0] = createdBy;
        index[count++] = addr;
    }
    
    modifier onlyByRequestHandler() {
        if (registry.getAddress("handler") != msg.sender)
            throw;
        _
    }
    
    modifier onlyByMint() {
        if (registry.getAddress("mint") != msg.sender)
            throw;
        _
    }
    
    modifier onlyByMember() {
        if (members[msg.sender].status != 2)
            throw;
        _
    }
    
    // Add a prospect to the db 
    function addProspect(string name, address addr, uint amount) onlyByRequestHandler {
        if (members[addr].addr != 0x0)
           throw;
        // WRONG !!!! count is members and prospects
        var quorum = count / 2 + 1;
        var buyIn = calcBuyIn();
        buyIn =+ amount;
        members[addr] = Member({name:name, addr:addr, amount:buyIn, total:0, status:1, quorum:quorum, signatureCount:0});
        index[count] = addr;
        count++;
    }
    
    // Set member status 
    function setMember(address addr) onlyByRequestHandler {
        if (members[addr].status == 0) { 
            throw;
        }
        if (members[addr].status == 1) {
            members[addr].status = 2;
        } else {
            throw;
        }
    }
    
    // TODO: Considder Thilos estetics
    function setMinted(address addr) onlyByMint {
        if (members[addr].status == 0) {
           throw;
        }
        members[addr].total =+ members[addr].amount;
        members[addr].amount = 0;
    }
    
    // isConsortiumMember
    function isConsortiumMember(address addr) {
        if (members[addr].status != 2)
            throw;
    }
    
    // isConsortiumProspect -- Not needed so far
    function isConsortiumProspect(address addr) {
        if (members[addr].status != 1)
            throw;
    }
    
    // convinience function to get count of prospects
    function getProspectCount() returns (uint prospectCount) {
        for (uint i=0; i < count; i++) {
            if (members[index[i]].status == 1)
                prospectCount++;
        }
        return (prospectCount);
    }
    
    // what is the buy in right now??
    function calcBuyIn() returns (uint buyin) {
        for (uint i=0; i < count; i++) {
            if (members[index[i]].status == 2)
                buyin =+ members[index[i]].total;
        }
        return (buyin/2);
    }
    
    // Approve prospect
    
    function approveProspect(address addr) onlyByMember {
        // only for prospects
        if (members[addr].status == 1) {
            // go thru all approvers so far and check for duplicates
            for (uint i=0; i < members[addr].signatureCount; i++) {
                if (members[addr].signingMembers[i] == msg.sender) {
                    throw;
                }
            }
            // has quorum been reached already?
            if (members[addr].signatureCount < members[addr].quorum) {
                members[addr].signingMembers[members[addr].signatureCount] = msg.sender;
                members[addr].signatureCount++;
                // is quorum reached with this signature?
                if (members[addr].signatureCount == members[addr].quorum) {
                    members[addr].status = 2;
                    // TODO: call mint
                }
            } else {
               throw;
            }
        } else {
            throw;
        }
    }
    
}