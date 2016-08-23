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

  it("should know its type", () => {
    Contact.new().then((contact) => {
      return contact.contractType.call().then((type) => {
        assert.equal(type, "contact", "contact does not know its type");
      });
    });
  });

  it("should set contact info", () => {
    var contact = Contact.deployed();

    return contact.setContact(mfs).then((tx_id) => {
      return contact.getContact.call();
    }).then((res) => {
      assert.equal(res, mfs, "contact not stored correctly");
    });
  });
});
