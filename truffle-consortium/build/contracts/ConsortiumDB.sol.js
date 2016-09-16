var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("ConsortiumDB error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("ConsortiumDB error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("ConsortiumDB contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of ConsortiumDB: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to ConsortiumDB.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: ConsortiumDB not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "setMinted",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "createdBy",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "isConsortiumMember",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "addr",
            "type": "address"
          },
          {
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "addProspect",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getProspectCount",
        "outputs": [
          {
            "name": "prospectCount",
            "type": "uint256"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "isConsortiumProspect",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "setMember",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getMemberCount",
        "outputs": [
          {
            "name": "prospectCount",
            "type": "uint256"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "status",
            "type": "uint256"
          }
        ],
        "name": "getCountByStatus",
        "outputs": [
          {
            "name": "statusCount",
            "type": "uint256"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "calcBuyIn",
        "outputs": [
          {
            "name": "buyin",
            "type": "uint256"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "approveProspect",
        "outputs": [],
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "type": "constructor"
      }
    ],
    "unlinked_binary": "0x6060604052604051602080610a00833990516000805433600160a060020a0319918216811780845560018054909316851783556101a06040908152600a6101609081527f6d65746166696e616e7a0000000000000000000000000000000000000000000061018052608090815260a09390935260c085905260e08590526002610100818152610120869052610140869052600160a060020a0390931686528088529085208054818752958890207f6d65746166696e616e7a000000000000000000000000000000000000000000148255969793969095869561010a9590821615909402600019011691909104601f01919091048101905b808211156101c357600081556001016100f6565b505060208281015160018381018054600160a060020a031990811690931790556040858101516002868101919091556060870151600380880191909155608088015160048089019190915560a0890151600589015560c0989098015160069097019690965560008054600160a060020a0316808252918652828120818052600701865282812080548616909217909155865492830190965590855292909152912080549091168217905550610839806101c76000396000f35b5090566060604052361561008d5760e060020a600035046314d4a7dc811461008f5780633a5673a41461012d57806364ceab061461013f5780636970be161461016e57806369e4c17c1461024457806380d5acc114610253578063923e51d514610281578063997072f71461030d578063c84ab3ca1461031d578063d7a404be14610371578063efcc7d2614610412575b005b61008d6004356040805160015460e060020a63bf40fac10282526020600483810182905260248401527f6d696e740000000000000000000000000000000000000000000000000000000060448401529251600160a060020a033381169492169263bf40fac192606480830193919282900301816000876161da5a03f11561000257505060405151600160a060020a0316909114905061049d57610002565b610440600054600160a060020a031681565b61008d600435600160a060020a0381166000908152600260208190526040909120600401541461049a57610002565b6040805160206004803580820135601f810184900484028501840190955284845261008d9491936024939092918401919081908401838280828437509496505093359350506044359150506040805160015460e060020a63bf40fac10282526020600483018190526007602484015260c960020a663430b7323632b9026044840152925160009384938493600160a060020a033381169491169263bf40fac19260648082019391829003018188876161da5a03f11561000257505060405151600160a060020a031690911490506104c457610002565b61045d60006106906001610324565b61008d600435600160a060020a03811660009081526002602052604090206004015460011461049a57610002565b61008d6004356040805160015460e060020a63bf40fac10282526020600483018190526007602484015260c960020a663430b7323632b90260448401529251600160a060020a033381169492169263bf40fac192606480830193919282900301816000876161da5a03f11561000257505060405151600160a060020a0316909114905061069557610002565b61045d5b60006106906002610324565b61045d6004355b6000805b6004548110156106f857600081815260036020908152604080832054600160a060020a03168352600290915290206004015483141561036957600191909101905b600101610328565b61045d5b6000805b60045481101561068557600081815260036020908152604080832054600160a060020a0316835260029182905290912060040154141561040a57600260005060006003600050600084815260200190815260200160002060009054906101000a9004600160a060020a0316600160a060020a0316815260200190815260200160002060005060030160005054915081505b600101610379565b61008d600435600160a060020a0333166000908152600260208190526040822060040154146106fe57610002565b60408051600160a060020a03929092168252519081900360200190f35b60408051918252519081900360200190f35b600160a060020a03811660009081526002602081905260408220908101805460039290920191909155555b50565b600160a060020a038116600090815260026020526040812060040154141561046f57610002565b600160a060020a03858116600090815260026020526040812060010154909116146104ee57610002565b6104f6610311565b9250600283046001019150610509610375565b50506040805160e081018252868152602081810187905281830186905260006060830181905260016080840181905260a0840186905260c08401829052600160a060020a03891682526002808452948220805485518051838652948690208b9893968796601f968516156101000260001901909416949094048501849004810194929390929101908390106105c157805160ff19168380011785555b506105f19291505b8082111561068c57600081556001016105ad565b828001600101855582156105a5579182015b828111156105a55782518260005055916020019190600101906105d3565b50506020828101516001838101805473ffffffffffffffffffffffffffffffffffffffff19908116909317905560408581015160028601556060860151600380870191909155608087015160048781019190915560a0880151600588015560c09097015160069690960195909555855460009081529490935291909220805490921688179091558154019055505050505050565b6002820491505b5090565b905090565b600160a060020a03811660009081526002602052604081206004015414156106bc57610002565b600160a060020a038116600090815260026020526040902060040154600114156106f357604060002060026004919091015561049a565b610002565b50919050565b600160a060020a038216600090815260026020526040902060040154600114156106f3575060005b600160a060020a03821660009081526002602052604090206006015481101561077557604060008181208382526007016020522054600160a060020a0390811633909116141561083157610002565b600160a060020a038216600090815260026020526040902060058101546006919091015410156106f357604060008181206006810180548352600782016020908152938320805473ffffffffffffffffffffffffffffffffffffffff191633179055600160a060020a0386169092526002909252805460010190819055600590910154141561082d5760026002600050600084600160a060020a03168152602001908152602001600020600050600401600050819055505b5050565b60010161072656",
    "events": {},
    "updated_at": 1473176322225,
    "links": {},
    "address": "0x6f0403c65af9359f845e4e888402d6837d7daa7c"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "ConsortiumDB";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.ConsortiumDB = Contract;
  }
})();
