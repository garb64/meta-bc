contract('Contact', (accounts) => {

    var admin = accounts[0];
    var cp1 = accounts[1];
    var cp2 = accounts[2];
    var user1 = accounts[5];
    var user2 = accounts[6];

    var mf = {
        n: "Systems Systeme GmbH",
        e: "kontakt@systemsysteme.de",
        a1: "Torstr. 146",
        z: "80888",
        c: "München",
        p1: "+49 89 122345-0"
    };
    var mfs = JSON.stringify(mf);

    it("should be registry aware", () => {
        var r = Registry.deployed();
        return Contact.new().then((c) => {
            return c.setRegistryAddress(r.address).then((tx_id) => {
                return c.REGISTRY.call().then((addr) => {
                    assert.equal(addr, r.address, "contact is not registry aware");
                });
            });
        });
    });

    it("should know its type", () => {
        return Contact.new().then((contact) => {
            return contact.contractType.call().then((type) => {
                assert.equal(type, "contact", "contact does not know its type");
            });
        });
    });

    it("should set contact info", () => {
        return Contact.new().then((contact) => {
            return contact.setContact(mfs).then((tx_id) => {
                return contact.getContact.call();
            }).then((res) => {
                assert.equal(res, mfs, "contact not stored correctly");
            });
        });
    });

    it("should log contact changes");

});
