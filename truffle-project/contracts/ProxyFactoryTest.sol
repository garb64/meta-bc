import "./ProxyFactory.sol";

contract ProxyFactoryTest {

    address proxyAddress;

    function buildProxy(address factoryAddress, address userAccount) returns(bool res) {
        ProxyFactory pf = ProxyFactory(factoryAddress);
        proxyAddress = pf.buildProxy(userAccount);
    }

    function getProxyAddress() returns(address addr) {
        return proxyAddress;
    }

}