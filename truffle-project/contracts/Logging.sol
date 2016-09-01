import "./RegistryAware.sol";
import "./Registry.sol";
import "./Logger.sol";

contract Logging is RegistryAware {

    string public contractType;

    function log(string message) internal returns (bool res) {
        Logger(Registry(REGISTRY).getContractAddress("logger")).log(contractType, message);
        return true;
    }

    function toAsciiString(address x) internal returns (string) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }

    function char(byte b) private returns (byte c) {
        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }


}