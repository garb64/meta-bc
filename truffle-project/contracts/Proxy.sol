import "./RegistryAware.sol";
import "./Registry.sol";
import "./ContractFactory.sol";

contract Proxy is RegistryAware {

    // the owning account
    address userAccount;
    // register of various contracts
    mapping (bytes32 => address) public contracts;
    // for testing of the factory
    string public contractType;

    function Proxy(address account) {
        userAccount = account;
        contractType = "proxy";
    }

    function isA() returns(string res) {
        return contractType;
    }

    function getUserAccount() returns(address account) {
        return userAccount;
    }

    function initContact() returns (bool res) {
        address cf = Registry(REGISTRY).contracts("contractFactory");
        address contact = ContractFactory(cf).buildContract("contact");
        contracts["contact"] = contact;
        return true;
    }

    function getContactAddress() returns(address addr) {
        return contracts["contact"];
    }

}