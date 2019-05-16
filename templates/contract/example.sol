pragma solidity ^0.5.8;

contract example {
    event Excution(address indexed sender);
    
    function excution() public {
        emit Excution(msg.sender);
    }
}