require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require('@oasisprotocol/sapphire-hardhat');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    sapphire: {
      url: process.env.SAPPHIRE_RPC_PROVIDER,
      accounts: [process.env.PRIVATE_KEY, process.env.MPC_KEY],
      chainId: 23294,
    },
    sapphiretestnet: {
      url: process.env.SAPPHIRE_TESTNET_RPC_PROVIDER,
      accounts: [process.env.PRIVATE_KEY, process.env.MPC_KEY],
      chainId: 23295,
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
