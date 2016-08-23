contract Contact {
    string public contractType;
    string contactJSON;

    function Contact() {
        contractType = "contact";
    }

    function setContact(string c) returns(bool res) {
        contactJSON = c;
        return true;
    }

    function getContact() returns(string contact) {
        return contactJSON;
    }

}