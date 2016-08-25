contract PermissionDb {
    string public contractType;

    mapping (string => mapping (string => uint8)) permissions;

    function PermissionDb() {
        contractType = "permissionDb";
    }

    function setPermission(string module, string entity, uint8 permission) returns(bool res) {
        permissions[module][entity] = permission;
        return true;
    }

    function getPermission(string module, string entity) returns(uint8 permission) {
        return permissions[module][entity];
    }
}