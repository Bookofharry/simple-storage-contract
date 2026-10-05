// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Simple Storage
/// @notice Anyone can store a number and read the latest stored value.
contract SimpleStorage {
    uint256 private storedNumber;

    /// @notice Replace the stored number with a new unsigned integer.
    function store(uint256 newNumber) public {
        storedNumber = newNumber;
    }

    /// @notice Read the stored number; initially zero.
    function retrieve() public view returns (uint256) {
        return storedNumber;
    }
}
