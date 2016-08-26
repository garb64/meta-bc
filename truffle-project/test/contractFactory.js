contract('ContractFactory', (accounts) => {

    it("should be registry aware", () => {
        var r = Registry.deployed();
        return ContractFactory.new().then((cf) => {
            return cf.setRegistryAddress(r.address).then((tx_id) => {
                return cf.REGISTRY.call().then((addr) => {
                    assert.equal(addr, r.address, "contract factory is not registry aware");
                });
            });
        });
    });


    it("should build contact contracts", () => {
        var contractFactory = ContractFactory.deployed();

        return ContractFactoryTest.new().then((cft) => {
            return cft.buildContract(contractFactory.address, "contact").then((tx_id) => {
                return cft.getContractAddress.call("contact").then((addr) => {
                    var contact = Contact.at(addr);
                    return contact.contractType.call().then((t) => {
                        assert.equal(t, "contact", "contract factory did not build a contact");
                    });
                });
            });
        });
    });

    it("should inject the registry address into contact contracts", () => {
        var contractFactory = ContractFactory.deployed();
        var r = Registry.deployed();

        return contractFactory.setRegistryAddress(r.address).then((tx_id) => {
            return ContractFactoryTest.new().then((cft) => {
                return cft.buildContract(contractFactory.address, "contact").then((tx_id) => {
                    return cft.getContractAddress.call("contact").then((addr) => {
                        var c = Contact.at(addr);
                        return c.REGISTRY.call().then((t) => {
                            assert.equal(t, r.address, "contract factory did not inject registry address into contact");
                        });
                    });
                });
            });

        });
    });

    it("should build permission DB contracts", () => {
        var contractFactory = ContractFactory.deployed();

        return ContractFactoryTest.new().then((cft) => {
            return cft.buildContract(contractFactory.address, "permissionDb").then((tx_id) => {
                return cft.getContractAddress.call("permissionDb").then((addr) => {
                    var pdb = PermissionDb.at(addr);
                    return pdb.contractType.call().then((t) => {
                        assert.equal(t, "permissionDb", "contract factory did not build a permission Db");
                    });
                });
            });
        });
    });

    it("should build permission manager contracts", () => {
        var contractFactory = ContractFactory.deployed();

        return ContractFactoryTest.new().then((cft) => {
            return cft.buildContract(contractFactory.address, "permissionMgr").then((tx_id) => {
                return cft.getContractAddress.call("permissionMgr").then((addr) => {
                    var pmg = PermissionMgr.at(addr);
                    return pmg.contractType.call().then((t) => {
                        assert.equal(t, "permissionMgr", "contract factory did not build a permission manager");
                    });
                });
            });
        });
    });

    it("should inject the registry address into permission manager contracts", () => {
        var contractFactory = ContractFactory.deployed();
        var r = Registry.deployed();

        return contractFactory.setRegistryAddress(r.address).then((tx_id) => {
            return ContractFactoryTest.new().then((cft) => {
                return cft.buildContract(contractFactory.address, "permissionMgr").then((tx_id) => {
                    return cft.getContractAddress.call("permissionMgr").then((addr) => {
                        var pmg = PermissionMgr.at(addr);
                        return pmg.REGISTRY.call().then((t) => {
                            assert.equal(t, r.address,
                                "contract factory did not inject registry address into permission manager");
                        });
                    });
                });
            });

        });
    });

});
