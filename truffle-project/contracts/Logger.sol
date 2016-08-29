contract Logger {

    event LogEvent(
        uint timeStamp,
        string severity,
        string module,
        string message
    );

    function log(string module, string message) {
        LogEvent(now, "LOG", module, message);
    }
}