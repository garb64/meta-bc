contract Logger {

    event LogEvent(
        uint timeStamp,
        string severity,
        string message
    );

    function log(string message) {
        LogEvent(now, "LOG", message);
    }
}