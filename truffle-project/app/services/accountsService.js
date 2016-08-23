metaBc.factory('accountsService', [ '$q', function($q) {

    var deferObject;
    var accounts;

    return {
        getAccounts: function () {
            deferObject = deferObject || $q.defer();
            web3.eth.getAccounts(function(err, accs) {
                if (err != null) {
                    deferObject.reject("There was an error fetching your accounts.");
                    return;
                }

                if (accs.length == 0) {
                    deferObject.reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                    return;
                }
                deferObject.resolve(accs);
            });

            return deferObject.promise;
        }
    };

}]);