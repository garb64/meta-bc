contract ConsortiumRegistry {

    address public owner = msg.sender;
 
    mapping(string => address) consortiumList;

    modifier onlyByOwner()
    {
        if (msg.sender != owner)
            throw;
        _
    }

    function setAddress(string key, address addr) onlyByOwner() {
        if (consortiumList[key] != 0x0) 
            throw;
        consortiumList[key] = addr;
    }

    function getAddress(string key) returns (address addr) {
        return consortiumList[key];
    }
}