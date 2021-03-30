/* eslint-disable @typescript-eslint/no-var-requires */
const { ethers } = require("ethers");
const chainIdConfig = require("../modules/web3/configs/chainId.json");
const networkConfig = require("../modules/web3/configs/network.json");
const { abi } = require("../modules/web3/configs/erc721.json");

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

module.exports.getContractsForChainId = (chainId) => {
  const networkName = chainIdConfig[chainId];
  const { rpc } = networkConfig[networkName];
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const erc721Contract = new ethers.Contract(NULL_ADDRESS, abi, provider);
  return { erc721Contract };
};
