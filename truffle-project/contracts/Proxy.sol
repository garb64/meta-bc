import "./RegistryAware.sol";
import "./Registry.sol";
import "./ContractFactory.sol";

contract Proxy is RegistryAware {

    mapping (bytes32 => address) public contracts;

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