import "./RegistryAware.sol";
import "./PermissionDb.sol";

contract PermissionMgr is RegistryAware {
    string public contractType;

    address permissionDbAddr;

    function PermissionMgr() {
        contractType = "permissionMgr";
    }

    function setPermissionDb(address addr) {
        permissionDbAddr = addr;
    }

    function setPermission(string module, string entity, uint8 permission) returns(bool res) {
        PermissionDb pdb = PermissionDb(permissionDbAddr);
        return pdb.setPermission(module, entity, permission);
    }

    function getPermission(string module, string entity) returns(uint8 permission) {
        PermissionDb pdb = PermissionDb(permissionDbAddr);
        return pdb.getPermission(module,entity);
    }
}