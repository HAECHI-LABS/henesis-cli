pragma solidity ^0.5.8;

contract example {
    event Execution(address indexed sender);
    event Execution(address indexed sender, address dummy);

    function execution() public {
        emit Execution(msg.sender);
        emit Execution(msg.sender, address(0));
    }
}
