metaBc.factory('contactService', ['$q', function($q) {

    var account = 0x0;
    var contact = 0;

    return {

        init: function (userAccount, contactAddress) {
            account = userAccount;
            contact = Contact.at(contactAddress);
        },

        setContact: function (contactJSON) {
            var defer = $q.defer();
            contact.setContact.sendTransaction(contactJSON, {from: account}).then(function (tx_id) {
                return contact.getContact.call().then(function (res) {
                    if (res == contactJSON) defer.resolve(true);
                    else defer.reject('something went wrong');
                });
            });
            return defer.promise;
        },

        getContact: function () {
            var defer = $q.defer();
            contact.getContact.call().then(function (res) {
                defer.resolve(res);
            });
            return defer.promise;
        }
    };

}]);