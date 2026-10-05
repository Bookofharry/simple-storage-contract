import assert from "node:assert/strict";
import { network } from "hardhat";

const connection = await network.create();
try {
  const { ethers } = connection;
  const contract = await ethers.deployContract("SimpleStorage");
  await contract.waitForDeployment();

  assert.equal(await contract.retrieve(), 0n);
  console.log("PASS: initial value is zero");

  await (await contract.store(42n)).wait();
  assert.equal(await contract.retrieve(), 42n);
  console.log("PASS: stores and retrieves 42");

  await (await contract.store(100n)).wait();
  assert.equal(await contract.retrieve(), 100n);
  console.log("PASS: overwrites a previous value");

  await (await contract.store(0n)).wait();
  assert.equal(await contract.retrieve(), 0n);
  console.log("PASS: resets the value to zero");

  await (await contract.store(ethers.MaxUint256)).wait();
  assert.equal(await contract.retrieve(), ethers.MaxUint256);
  console.log("PASS: stores the maximum uint256 value");

  const [, secondAccount] = await ethers.getSigners();
  await (await contract.connect(secondAccount).getFunction("store")(7n)).wait();
  assert.equal(await contract.retrieve(), 7n);
  console.log("PASS: another account can update the shared value");

  console.log("All 6 checks passed on a local simulated blockchain.");
} finally {
  await connection.close();
}
