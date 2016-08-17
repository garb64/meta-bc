contract('ProxyFactory', (accounts) => {

  it("should be registry aware", () => {
    var proxyFactory = ProxyFactory.deployed();
    var registry = Registry.deployed();

    return proxyFactory.setRegistryAddress(registry.address).then((tx_id) => {
      return proxyFactory.getRegistryAddress.call().then((addr) => {
        assert.equal(addr, registry.address, "proxy factory is not registry aware");
      });
    });
  });

  it("should build proxies", () => {
    var proxyFactory = ProxyFactory.deployed();
    var proxyFactoryTest = ProxyFactoryTest.deployed();

    return proxyFactoryTest.buildProxy(proxyFactory.address).then((tx_id) => {
      return proxyFactoryTest.getProxyAddress.call().then((addr) => {
        proxy = Proxy.at(addr);
        return proxy.isA.call().then((t) => {
          assert.equal(t, "proxy", "proxy factory did not build a proxy");
        });
      });
    });
  });

  it("should initialize the proxy's registry address", () => {
    var proxyFactory = ProxyFactory.deployed();
    var proxyFactoryTest = ProxyFactoryTest.deployed();
    var registry = Registry.deployed();

    return proxyFactory.setRegistryAddress(registry.address).then((tx_id) => {
      return proxyFactoryTest.buildProxy(proxyFactory.address).then((tx_id) => {
        return proxyFactoryTest.getProxyAddress.call().then((addr) => {
          proxy = Proxy.at(addr);
          return proxy.getRegistryAddress.call().then((addr) => {
            assert.equal(addr, registry.address, "proxy is missing registry address")
          });
        });
      });
    });
  });

  describe("access control", () => {

    var admin = accounts[0];
    var cp1 = accounts[1];
    var cp2 = accounts[2];
    var user1 = accounts[5];
    var user2 = accounts[6];

    it("should allow admin to build proxies", () => {
      var proxyFactory = ProxyFactory.deployed();
      var proxyFactoryTest = ProxyFactoryTest.deployed();
      var events = proxyFactory.allEvents();

      return proxyFactoryTest.buildProxy(proxyFactory.address, { from: admin }).then((tx_id) => {
        return proxyFactoryTest.getProxyAddress.call().then((addr) => {
          assert.notEqual(addr, 0x0, "build proxy for admin failed");
        });
      });
    });

    it("should allow consortium partners to build proxies", () => {
      var proxyFactory = ProxyFactory.deployed();
      var proxyFactoryTest = ProxyFactoryTest.deployed();

      return proxyFactoryTest.buildProxy(proxyFactory.address, { from: cp1 }).then((tx_id) => {
        return proxyFactoryTest.getProxyAddress.call().then((addr) => {
          assert.notEqual(addr, 0x0, "build proxy for consortium partner failed");
        });
      });
    });

    it("should not allow others to build proxies", () => {
      var proxyFactory = ProxyFactory.deployed();
      var proxyFactoryTest = ProxyFactoryTest.deployed();

      return proxyFactoryTest.buildProxy(proxyFactory.address, { from: user1 }).then((tx_id) => {
        return proxyFactoryTest.getProxyAddress.call().then((addr) => {
          assert.equal(addr, 0x0, "build proxy for other failed");
        });
      });
    });

  });

});
