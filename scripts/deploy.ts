import { mkdir, readFile, writeFile } from "node:fs/promises";
import { network } from "hardhat";

const connection = await network.create();
try {
  const { ethers } = connection;
  const chain = await ethers.provider.getNetwork();
  if (chain.chainId !== 11155111n) throw new Error("Deployment is restricted to Sepolia.");
  const recordPath = "deployments/sepolia.json";
  try {
    await readFile(recordPath, "utf8");
    throw new Error("A deployment record already exists. Inspect it before deploying again.");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const [signer] = await ethers.getSigners();
  if (!signer) throw new Error("No Sepolia signer configured.");
  const balance = await ethers.provider.getBalance(signer.address);
  console.log(`Deployer: ${signer.address}; balance: ${ethers.formatEther(balance)} Sepolia ETH`);
  if (balance === 0n) throw new Error("Fund the wallet with Sepolia test ETH before deployment.");
  const contract = await ethers.deployContract("SimpleStorage");
  const transaction = contract.deploymentTransaction()!;
  const address = await contract.getAddress();
  await mkdir("deployments", { recursive: true });
  const record = { chainId: 11155111, address, deployer: signer.address, transactionHash: transaction.hash, status: "pending" };
  await writeFile(recordPath, JSON.stringify(record, null, 2) + "\n");
  console.log(`Submitted: https://sepolia.etherscan.io/tx/${transaction.hash}`);
  const receipt = await transaction.wait(2);
  if (receipt?.status !== 1) throw new Error("Deployment transaction failed.");
  if (await ethers.provider.getCode(address) === "0x") throw new Error("No deployed bytecode found.");
  const initialValue = await contract.retrieve();
  if (initialValue !== 0n) throw new Error("Unexpected initial storage value.");
  await writeFile(recordPath, JSON.stringify({ ...record, status: "confirmed", blockNumber: receipt.blockNumber, initialValue: initialValue.toString() }, null, 2) + "\n");
  console.log(`Deployed and checked: https://sepolia.etherscan.io/address/${address}`);
} finally {
  await connection.close();
}
