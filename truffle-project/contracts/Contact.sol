import "./Logging.sol";
import "./strings.sol";


contract Contact is RegistryAware, Logging {
    using strings for *;

    string contactJSON;

    function Contact() {
        contractType = "contact";
    }

    function setContact(string c) returns(bool res) {
        contactJSON = c;
        log(toAsciiString(msg.sender).toSlice().concat((" changed address: ".toSlice().concat(c.toSlice())).toSlice()));
        return true;
    }

    function getContact() returns(string contact) {
        return contactJSON;
    }

}