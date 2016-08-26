import "./RegistryAware.sol";
import "./PermissionDb.sol";
import "./PermissionMgr.sol";
import "./Contact.sol";

contract ContractFactory is RegistryAware {

    function buildContract(bytes32 contractName) returns(address addr) {
        addr = 0x0;
        if (contractName == "contact") {
            Contact c = new Contact();
            c.setRegistryAddress(REGISTRY);
            addr = c;
        }
        else if (contractName == "permissionDb") addr = new PermissionDb();
        else if (contractName == "permissionMgr") {
            PermissionMgr pmg = new PermissionMgr();
            pmg.setRegistryAddress(REGISTRY);
            addr = pmg;
        }
        return addr;
    }

}