contract('PermissionDb', (accounts) => {

  it("should know its type", () => {
    return PermissionDb.new().then((pdb) => {
      return pdb.contractType.call().then((type) => {
         assert.equal(type, "permissionDb", "permission db does not know its type");
      });
    });
  });

  it("should store permissions", () => {
    return PermissionDb.new().then((pdb) => {
      return pdb.setPermission("1", "2", 0xf).then((tx_id) => {
        return pdb.getPermission.call("1", "2").then((res) => {
          assert.equal(res, 0xf, "permission db stores permissions incorrectly");
        });
      });
    });
  });
});
