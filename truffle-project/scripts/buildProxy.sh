#!/usr/bin/env bash

partnerAccount="0x2f9233188c82fc603469f8ebc7edd0803a12d17d"
partnerPassword="1234"
userAccount=$1
# TODO: check for validity of userAccount

unlock="personal.unlockAccount('$partnerAccount', '$partnerPassword', 60);"

# unlock Account
echo $unlock | geth attach ipc:/var/geth_dev/geth.ipc > /dev/null || exit

# call truffle script
scriptDir=$(dirname $0)
truffle exec ${scriptDir}/buildProxy.js $userAccount $partnerAccount
