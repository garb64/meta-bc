metaBc.controller('userController', function($scope, $routeParams, ngToast, proxyService, contactService) {

    $scope.contracts = {
        "contact": { desc: "Addressfreigabe" },
        "mileage": { desc: "Kilometerstandsmeldung" }
    };

    function getContracts() {
        angular.forEach($scope.contracts, function(value, key) {
            proxyService.getContractAddress($scope.proxy, key).then(function (addr) {
                if (addr != 0) value.address = addr;
            });
        });
    }

    function setContractAddress(contractName, addr) {
        $scope.contracts[contractName].address = addr;
    }

    $scope.userAccount = $routeParams.userAccount;
    $scope.proxy = $routeParams.proxy;
    $scope.editor = null;

    getContracts();

    $scope.addContract = function (contractName) {
        proxyService.addContract($scope.userAccount, $scope.proxy, contractName).then(function (addr) {
            if (addr != 0) {
                setContractAddress(contractName, addr);
            } else {
                console.log('addContract returned 0x0');
            }
        });
    };

    $scope.editContract = function (contractName) {
        $scope.editor = contractName;

        // initialize editor
        switch($scope.editor) {
            case "contact":
                contactService.init($scope.userAccount, $scope.contracts["contact"].address);
                contactService.getContact().then(function (contactJson) {
                   if (contactJson) $scope.contact = JSON.parse(contactJson);
                });
                break;
            default:
            // nothing to do
        }
    };

    $scope.setContact = function (c) {
        var contactJSON = JSON.stringify(c);
        contactService.setContact(contactJSON).then(function (res) {
            ngToast.info("Address data updated");
        });

    }
});