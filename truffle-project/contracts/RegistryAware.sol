// Base class for contracts that are use the registry

contract RegistryAware {
    address public REGISTRY;

    function setRegistryAddress(address registryAddr) returns (bool result){
        // Once the registry address is set, don't allow it to be set again, except by the
        // registry contract itself.
        // if (REGISTRY != 0x0 && msg.sender != REGISTRY){
        //     return false;
        // }
        REGISTRY = registryAddr;
        return true;
    }

}