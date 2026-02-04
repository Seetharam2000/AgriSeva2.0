# Blockchain Demo

This is a minimal Solidity contract for hackathon demos.

## Quick Start (Remix)
- Open https://remix.ethereum.org
- Create `FarmData.sol` and paste the contract
- Compile with Solidity `0.8.20`
- Deploy to Remix VM or a testnet

## Functions
- `registerFarmerData(farmerId, dataHash)`
- `logDataAccess(farmerId, dataHash, action)`
- `getAccessLogs()`
