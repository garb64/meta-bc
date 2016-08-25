contract('Proxy', (accounts) => {

    var user1 = accounts[3];

    it("should be registry aware", () => {
        var r = Registry.deployed();
        var p = Proxy.deployed();

        return Proxy.new(user1).then((p) => {
            return p.setRegistryAddress(r.address).then((tx_id) => {
                return p.REGISTRY.call().then((addr) => {
                    assert.equal(addr, r.address, "proxy is not registry aware");
                });
            });
        });
    });

    it("should know its userAccount", () => {
        return Proxy.new(user1).then((proxy) => {
            return proxy.getUserAccount.call().then((addr) => {
                assert.equal(addr, user1, "proxy does not know its user account");
            });
        });
    });

    it("should build a contact contract", () => {
        var registry = Registry.deployed();
        var contractFactory = ContractFactory.deployed();

        return Proxy.new(user1).then((proxy) => {
            return registry.addContract("contractFactory", contractFactory.address).then((tx_id) => {
                return proxy.setRegistryAddress(registry.address).then((tx_id) => {
                    return proxy.initContract("contact").then((tx_id) => {
                        return proxy.getContractAddress.call("contact").then((addr) => {
                            return Contact.at(addr).contractType.call().then((res) => {
                                assert.equal(res, "contact", "proxy does not build contact contracts");
                            });
                        });
                    });
                });
            });
        });
    });

    it("should build a permission DB contract", () => {
        var registry = Registry.deployed();
        var contractFactory = ContractFactory.deployed();

        return Proxy.new(user1).then((proxy) => {
            return registry.addContract("contractFactory", contractFactory.address).then((tx_id) => {
                return proxy.setRegistryAddress(registry.address).then((tx_id) => {
                    return proxy.initContract("permissionDb").then((tx_id) => {
                        return proxy.getContractAddress.call("permissionDb").then((addr) => {
                            return PermissionDb.at(addr).contractType.call().then((res) => {
                                assert.equal(res, "permissionDb", "proxy does not build permissionDb contracts");
                            });
                        });
                    });
                });
            });
        });
    });

    it("should build a permission manager contract", () => {
        var registry = Registry.deployed();
        var contractFactory = ContractFactory.deployed();

        return Proxy.new(user1).then((proxy) => {
            return registry.addContract("contractFactory", contractFactory.address).then((tx_id) => {
                return proxy.setRegistryAddress(registry.address).then((tx_id) => {
                    return proxy.initContract("permissionMgr").then((tx_id) => {
                        return proxy.getContractAddress.call("permissionMgr").then((addr) => {
                            return PermissionMgr.at(addr).contractType.call().then((res) => {
                                assert.equal(res, "permissionMgr", "proxy does not build permissionMgr contracts");
                            });
                        });
                    });
                });
            });
        });
    });

});
