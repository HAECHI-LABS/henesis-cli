pragma solidity ^0.5.8;

contract example {
    event Excution(address indexed sender);
    event Excution(address indexed sender, address dummy);
    
    function excution() public {
        emit Excution(msg.sender);
        emit Excution(msg.sender, address(0));
    }
}