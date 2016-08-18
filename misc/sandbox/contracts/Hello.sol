contract Hello {
    event Hi(address sender);

    function sayHi() returns(address sender) {
        sender = msg.sender;
        Hi(sender);
        return sender;
    }
}
