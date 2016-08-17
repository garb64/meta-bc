import "./Contact.sol";

contract ContractFactory {

    function buildContract(bytes32 contractName) returns(address addr) {
        addr = 0x0;
        if (contractName == "contact") addr = new Contact();
        return addr;
    }

}