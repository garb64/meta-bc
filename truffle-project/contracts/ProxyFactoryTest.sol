import "./ProxyFactory.sol";

contract ProxyFactoryTest {

    address proxyAddress;

    function buildProxy(address factoryAddress) returns(bool res) {
        ProxyFactory pf = ProxyFactory(factoryAddress);
        proxyAddress = pf.buildProxy();
    }

    function getProxyAddress() returns(address addr) {
        return proxyAddress;
    }

}