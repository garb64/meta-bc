import "./RegistryAware.sol";
import "./Proxy.sol";

contract ProxyFactory is RegistryAware {
    event ProxyBuilt(address account, address proxyAddress);

    function buildProxy(address userAccount) returns(address addr) {
        Proxy p = new Proxy(userAccount);
        p.setRegistryAddress(REGISTRY);
        addr = p;
        ProxyBuilt(msg.sender, addr);
        return addr;
    }
}