// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FarmDataRegistry {
    struct AccessLog {
        address accessor;
        string farmerId;
        string dataHash;
        string action;
        uint256 timestamp;
    }

    mapping(string => string[]) private farmerDataHashes;
    AccessLog[] private accessLogs;

    event FarmerDataRegistered(string farmerId, string dataHash);
    event DataAccessLogged(address accessor, string farmerId, string dataHash, string action);

    function registerFarmerData(string memory farmerId, string memory dataHash) public {
        farmerDataHashes[farmerId].push(dataHash);
        emit FarmerDataRegistered(farmerId, dataHash);
    }

    function logDataAccess(
        string memory farmerId,
        string memory dataHash,
        string memory action
    ) public {
        accessLogs.push(
            AccessLog({
                accessor: msg.sender,
                farmerId: farmerId,
                dataHash: dataHash,
                action: action,
                timestamp: block.timestamp
            })
        );
        emit DataAccessLogged(msg.sender, farmerId, dataHash, action);
    }

    function getAccessLogs() public view returns (AccessLog[] memory) {
        return accessLogs;
    }
}
