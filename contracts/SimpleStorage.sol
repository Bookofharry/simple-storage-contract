// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleStorage {
    uint256 private storedNumber;

    function store(uint256 newNumber) public {
        storedNumber = newNumber;
    }

    function retrieve() public view returns (uint256) {
        return storedNumber;
    }
}
