import "./ContractFactory.sol";

contract ContractFactoryTest {

    mapping (bytes32 => address) contracts;

    function buildContract(address factoryAddress, bytes32 contractName) returns(bool res) {
        ContractFactory cf = ContractFactory(factoryAddress);
        contracts["contact"] = cf.buildContract(contractName);
    }

    function getContractAddress(bytes32 contractName) returns(address addr) {
        return contracts[contractName];
    }

}