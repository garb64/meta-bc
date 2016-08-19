contract('ProxyFactory', (accounts) => {

  var user1 = accounts[3];

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

    return ProxyFactoryTest.new().then((proxyFactoryTest) => {
      return proxyFactoryTest.buildProxy(proxyFactory.address, user1).then((tx_id) => {
        return proxyFactoryTest.getProxyAddress.call().then((addr) => {
          var proxy = Proxy.at(addr);
          return proxy.isA.call().then((t) => {
            assert.equal(t, "proxy", "proxy factory did not build a proxy");
          });
        });
      });
    });

  });

  it("should initialize the proxy's registry address", () => {
    var proxyFactory = ProxyFactory.deployed();
    var registry = Registry.deployed();

    return ProxyFactoryTest.new().then((proxyFactoryTest) => {
      return proxyFactory.setRegistryAddress(registry.address).then((tx_id) => {
        return proxyFactoryTest.buildProxy(proxyFactory.address, user1).then((tx_id) => {
          return proxyFactoryTest.getProxyAddress.call().then((addr) => {
            proxy = Proxy.at(addr);
            return proxy.getRegistryAddress.call().then((addr) => {
              assert.equal(addr, registry.address, "proxy is missing registry address")
            });
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

      return ProxyFactoryTest.new().then((proxyFactoryTest) => {
        return proxyFactoryTest.buildProxy(proxyFactory.address, user1, { from: admin }).then((tx_id) => {
          return proxyFactoryTest.getProxyAddress.call().then((addr) => {
            assert.notEqual(addr, 0x0, "build proxy for admin failed");
          });
        });
      });

    });

    it("should allow consortium partners to build proxies", () => {
      var proxyFactory = ProxyFactory.deployed();

      return ProxyFactoryTest.new().then((proxyFactoryTest) => {
        return proxyFactoryTest.buildProxy(proxyFactory.address, user1, { from: cp1 }).then((tx_id) => {
          return proxyFactoryTest.getProxyAddress.call().then((addr) => {
            assert.notEqual(addr, 0x0, "build proxy for admin failed");
          });
        });
      });

    });

    it("should not allow others to build proxies", () => {
      var proxyFactory = ProxyFactory.deployed();

      return ProxyFactoryTest.new().then((proxyFactoryTest) => {
        return proxyFactoryTest.buildProxy(proxyFactory.address, user1, { from: user2 }).then((tx_id) => {
          return proxyFactoryTest.getProxyAddress.call().then((addr) => {
            assert.equal(addr, 0x0, "build proxy for admin failed");
          });
        });
      });

    });

  });

});
