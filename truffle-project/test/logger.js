contract('Logger', (accounts) => {

    it("should emit log events", (done) => {

        var logger = Logger.deployed();
        var log = logger.LogEvent();

        logger.log("module", "message", {from: accounts[0]}).then(new Promise(
            (resolve, reject) => {
                log.watch((error, event) => { resolve(event, done); log.stopWatching(); });
            }).then((log, done) => {
                assert.equal(log.args.severity, "LOG");
                assert.equal(log.args.module, "module");
                assert.equal(log.args.message, "message");
            }).then(done).catch(done));
    });

});
