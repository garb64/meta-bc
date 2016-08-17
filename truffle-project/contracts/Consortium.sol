contract Consortium {
    address public admin;
    mapping (address => bytes32) public partners;

    function Consortium() {
        admin = msg.sender;
    }

    function getAdminAddress() returns(address addr) {
        return admin;
    }

    function isAdmin(address addr) returns(bool res) {
        return admin == addr;
    }

    function addPartner(bytes32 name, address addr) returns(bool res) {
        partners[addr] = name;
        return true;
    }

    function getPartner(address addr) returns(bytes32 name) {
        return partners[addr];
    }

    function isPartner(address addr) returns(bool res) {
        return partners[addr] != 0;
    }

}