import "./RegistryAware.sol";
import "./Registry.sol";
import "./Logger.sol";

contract Contact is RegistryAware {
    string public contractType;
    string contactJSON;

    address loggerAddr;

    function Contact() {
        contractType = "contact";
    }

    // extend RegistryAware.setRegistryAddress to wire with Logger instance
    function setRegistryAddress(address registryAddr) returns (bool result) {
        if (RegistryAware.setRegistryAddress(registryAddr)) {
            loggerAddr = Registry(REGISTRY).getContractAddress("logger");
        }
    }

    function setContact(string c) returns(bool res) {
        contactJSON = c;
        Logger(loggerAddr).log(contractType, c);
        return true;
    }

    function getContact() returns(string contact) {
        return contactJSON;
    }

}