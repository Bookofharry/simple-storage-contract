# Simple Storage

My third assignment: setting up a GitHub repository and creating a simple storage contract.

The contract saves a number using `store()` and returns it with `retrieve()`. It starts at `0`. Calling `store(42)` changes it to `42`, and storing another number replaces the old one. Anyone can update the number.

## Run the project

Using Node.js 24 and Solidity 0.8.28:

```sh
npm ci
npm run compile
npm test
```

All six local checks pass: the starting value, storing a number, replacing it, resetting to zero, storing the largest uint256, and updating from another account.

## Sepolia

Deployment and verification are still pending. The test wallet needs Sepolia ETH.

The Windows wallet script keeps the private key encrypted locally in `.wallet/`, which is excluded from Git. The wallet can only be opened by the Windows account that created it.

```powershell
# Create a wallet once on a new setup
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/wallet.ps1 -Action create

# Show its address
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/wallet.ps1 -Action address

# Deploy after funding it with Sepolia test ETH
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/wallet.ps1 -Action deploy
```

The deployment address and transaction hash are saved in `deployments/sepolia.json`. If that file already exists, check its transaction before deploying again.

Verify on Blockscout after deployment:

```sh
npm run verify:sepolia -- CONTRACT_ADDRESS
```

For Etherscan, set `ETHERSCAN_API_KEY` in the local environment and run:

```sh
npx hardhat verify etherscan --network sepolia CONTRACT_ADDRESS
```

## Assignment videos

- [GitHub setup](https://youtu.be/MCkd8Y_CpZI)
- [Contract and testing](https://youtu.be/y1l3nTM_qNg)
- [Sepolia deployment and verification](https://youtu.be/j1g4S8NWRMQ)
