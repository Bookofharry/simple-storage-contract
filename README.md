# Simple Storage Contract

A beginner Solidity project for Assignment 3: Setting Up GitHub Repository and Creating Simple Storage Contract.

## Contract

[`contracts/SimpleStorage.sol`](contracts/SimpleStorage.sol) stores one unsigned 256-bit integer.

- `store(uint256 newNumber)` updates the stored number by sending a transaction.
- `retrieve()` reads the current number without changing state.
- The initial value is `0`. Any account can update it, and each update replaces the previous value.
- `private` controls Solidity access; it does not make blockchain data secret.

Example: call `store(42)`, then `retrieve()` returns `42`.

## Run locally

Install Node.js 24 LTS, then run:

```sh
git clone https://github.com/Bookofharry/simple-storage-contract.git
cd simple-storage-contract
npm ci
npm run compile
npm test
```

The first compilation downloads Solidity 0.8.28. Tests deploy to an ephemeral local Hardhat blockchain; no wallet, real ETH, or RPC account is needed.

The automated checks cover the initial value, storing 42, overwriting a value, resetting to zero, the maximum `uint256`, and updating from a second account. Assertion failures produce a nonzero exit code.

## Try in Remix

1. Open https://remix.ethereum.org and create `contracts/SimpleStorage.sol`.
2. Copy the contract from this repository.
3. Select Solidity compiler 0.8.28 and compile.
4. In Deploy & Run Transactions, select a Remix VM environment and deploy `SimpleStorage` (no constructor arguments).
5. Call `retrieve` to see `0`, call `store` with `42`, then call `retrieve` again.

## Walkthrough references

- [GitHub setup and writing Simple Storage](https://youtu.be/MCkd8Y_CpZI)
- [Writing and testing Simple Storage](https://youtu.be/y1l3nTM_qNg)
- [Sepolia deployment and verification](https://youtu.be/j1g4S8NWRMQ)

This is an independent minimal implementation of the written assignment. It is not a verified transcription of the walkthroughs. Local deployment is exercised by the tests; no Sepolia deployment or explorer verification is claimed.

## Submission

Submit this repository URL on the LMS:

https://github.com/Bookofharry/simple-storage-contract

Assignment deadline: October 6, 2026 at 22:00 (use the LMS timezone).
