contract('PermissionMgr', (accounts) => {

    it("should know its type", () => {
        return PermissionMgr.new().then((pmg) => {
            return pmg.contractType.call().then((type) => {
                assert.equal(type, "permissionMgr", "permission manager does not know its type");
            });
        });
    });

    it("should be registry aware", () => {
        var r = Registry.deployed();
        return PermissionMgr.new().then((pmg) => {
            return pmg.setRegistryAddress(r.address).then((tx_id) => {
                return pmg.REGISTRY.call().then((addr) => {
                    assert.equal(addr, r.address, "permission manager is not registry aware");
                });
            });
        });
    });

    it("should store permissions in its permission db", () => {
        return PermissionDb.new().then((pdb) => {
            return PermissionMgr.new().then((pmg) => {
                return pmg.setPermissionDb(pdb.address).then((tx_id) => {
                    return pmg.setPermission("entity", "role", 0xf).then((tx_id) => {
                        return pmg.getPermission.call("entity", "role").then((res) => {
                            assert.equal(res, 0xf, "permission manager stores permissions incorrectly");
                        });
                    });
                });
            });

        });
    });
});
