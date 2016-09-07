import "./ConsortiumRegistry.sol";
import "./ConsortiumMint.sol";


/*
 TODO: 
    Is name in member really needed?
    Do we need to considder primary account change?
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
        address addr; // Primary Account Address
        string name;  // Name might not be needed
        uint amount;
        uint total;
        uint status;
        uint quorum;
        uint signatureCount;
        mapping (uint => address) signingMembers;
        uint mintingSignatureCount;
        mapping (uint => address) mintingSignatures;
        uint mintedCount;
        mapping (uint => address) mintedAccounts;
    }    
    
    mapping(address => Member) members;
    mapping(uint  => address)  index;
    uint count;
    
    
    // Create instance of the consortium db and hard wire the address to the registry.
    // Add boot strapping member as first entry to members.
    function ConsortiumDB(address addr) {
        createdBy = msg.sender;
        registry = ConsortiumRegistry(addr);
        
        members[createdBy] = Member({name:"metafinanz", addr:msg.sender, amount:0, total:0, status:2, quorum:1, signatureCount:1, mintedCount:0, mintingSignatureCount:0});
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
    
    // TODO: Implement
    //       - Mint quoum
    // 
    function addMintRequest(uint amount, address addr) onlyByRequestHandler {
        // check if we have allread a mint request going on for this member
        if (members[addr].amount != 0) {
            throw;
        }
        members[addr].amount = amount;
        var memberCount = getMemberCount();
        var quorum = memberCount / 2 + 1; 
    }
    
    // Add a prospect to the db 
    function addProspect(string name, address addr, uint amount) onlyByRequestHandler {
        if (members[addr].addr != 0x0)
           throw;
        // calc quorum
        var memberCount = getMemberCount();
        var quorum = memberCount / 2 + 1;
        // calc buy in
        var buyIn = currentConsortiumValue();
        buyIn /= 2;
        // amount of prospect might be higher than the calculated buyin
        buyIn =+ amount;
        members[addr] = Member({name:name, addr:addr, amount:buyIn, total:0, status:1, quorum:quorum, signatureCount:0, mintedCount:0, mintingSignatureCount:0});
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
        return(getCountByStatus(1));
    }
    
    // members may get all informations on prospect
    function getProspectInfo(uint reqid) onlyByMember returns (address addr, string name, uint buyin, uint signatureCount) {
        for (uint i=0; i < count; i++) {
            if (members[index[i]].status == 1) {
                if (reqid == 0) {
                    return (members[index[i]].addr, members[index[i]].name, members[index[i]].amount, members[index[i]].signatureCount);
                }
                reqid--;
            }      
        }
        throw;
    }
    
    // convinience function to get count of members
    function getMemberCount() returns (uint prospectCount) {
        return(getCountByStatus(2));
    }
    
    function getCountByStatus(uint status) private returns (uint statusCount) {
        for (uint i=0; i < count; i++) {
            if (members[index[i]].status == status)
                statusCount++;
        }
        return (statusCount);
    }
    
    // what is the buy in right now??
    // Function needs to be public to tell prospects the buyin
    function currentConsortiumValue() returns (uint buyin) {
        for (uint i=0; i < count; i++) {
            if (members[index[i]].status == 2)
                buyin =+ members[index[i]].total;
        }
        return (buyin/2);
    }
    
    // 
    function callMint(address addr) private {
        ConsortiumMint mint = ConsortiumMint(registry.getAddress("mint"));
        address account = mint.startMint(addr, members[addr].amount);
        members[addr].mintedAccounts[members[addr].mintedCount++] = account;
        members[addr].total =+ members[addr].amount;
        members[addr].amount = 0;
    }
    
    // Confirm mint request
    function confirmMint(address addr) onlyByRequestHandler {
        if (members[addr].status == 2) {
           for (uint i=0; i < members[addr].mintingSignatureCount; i++) {
                if (members[addr].mintingSignatures[i] == sender) {
                    throw;
                }
            }
            // No quorum yet
            if (members[addr].mintingSignatureCount < members[addr].quorum) {  // YES quorum is reused for all quorums
                members[addr].mintingSignatures[members[addr].mintingSignatureCount] = sender;
                members[addr].mintingSignatureCount++;
                // is quorum reached with this signature?
                if (members[addr].mintingSignatureCount == members[addr].quorum) {
                    callMint(addr);
                }
        } else {
            throw;
        }
    }
    
    // Approve prospect
    function approveProspect(address sender, address addr) onlyByRequestHandler {
        // only for prospects
        if (members[addr].status == 1) {
            // go thru all approvers so far and check for duplicates
            for (uint i=0; i < members[addr].signatureCount; i++) {
                if (members[addr].signingMembers[i] == sender) {
                    throw;
                }
            }
            // has quorum been reached already?
            if (members[addr].signatureCount < members[addr].quorum) {
                members[addr].signingMembers[members[addr].signatureCount] = sender;
                members[addr].signatureCount++;
                // is quorum reached with this signature?
                if (members[addr].signatureCount == members[addr].quorum) {
                    members[addr].status = 2;
                    callMint(addr);
                }
            } else {
               throw;
            }
        } else {
            throw;
        }
    }
}