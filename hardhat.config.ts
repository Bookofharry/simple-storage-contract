import { configVariable, defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

export default defineConfig({
  plugins: [hardhatEthers, hardhatVerify],
  solidity: "0.8.28",
  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [configVariable("SEPOLIA_PRIVATE_KEY")] : [],
    },
  },
  verify: {
    etherscan: { enabled: Boolean(process.env.ETHERSCAN_API_KEY), apiKey: configVariable("ETHERSCAN_API_KEY") },
    blockscout: { enabled: true },
    sourcify: { enabled: true },
  },
});
