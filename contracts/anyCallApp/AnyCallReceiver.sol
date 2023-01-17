// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.10;

contract AnyCallReceiver {
    event ReceiveAnyCallMessage(bytes);

    function anyExecute(bytes calldata _data)
        external
        returns (bool success, bytes memory result)
    {
        emit ReceiveAnyCallMessage(_data);
        return (true, "");
    }
}
