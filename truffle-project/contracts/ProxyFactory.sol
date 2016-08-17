import "./RegistryAware.sol";
import "./Consortium.sol";
import "./Proxy.sol";

contract ProxyFactory is RegistryAware {
    event ProxyBuilt(address account, address proxyAddress);

    function buildProxy() returns(address addr) {
        // check if authorized; only admin or consortium partner
        address origin = tx.origin;
        address consortiumAddr = Registry(REGISTRY).contracts("consortium");
        Consortium c = Consortium(consortiumAddr);
        bool admin = c.isAdmin(origin);
        bool partner = c.isPartner(origin);
        addr = 0x0;
        if (admin || partner) {
            Proxy p = new Proxy();
            p.setRegistryAddress(REGISTRY);
            addr = p;

        }
        ProxyBuilt(origin, addr);
        return addr;
    }

}