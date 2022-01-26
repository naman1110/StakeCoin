// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0;

import "./dai.sol";
import "./Black.sol";
contract Farm{
	Dai public dai;
	Clover public clover;
	uint256 public price;
     address public owner;
	mapping (address => uint) public stk;
	mapping (address => bool) hstk;
	address[ ] public stakers;
	
  constructor(Clover _clover,Dai _dai,uint256  _price) public
  {
   dai=_dai;
   clover=_clover;
   price=_price;
     owner = msg.sender;
  }
  
  function stake (uint amount)  public {
  	  
  	  require (amount > 0,"no amount");
  	  
  	  dai.transferFrom(msg.sender,address(this),amount);

  	  stk[msg.sender]+=amount;
      
  	  hstk[msg.sender]=true;
     if(!hstk[msg.sender]){
      stakers.push(msg.sender);
}
      

  }

  function unstake () public {
  	uint balance=stk[msg.sender];
  	require(balance>0,"No balance left");
  
    dai.transfer(msg.sender,balance);
  balance=uint(balance)/100;
    balance=balance*20;
    clover.transfer(msg.sender, balance);
      stk[msg.sender]=0;
    hstk[msg.sender]=false;
  }
 
  /*function issue() public {
require(msg.sender == owner, "caller must be the owner");
  	    for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stk[recipient];

            if(balance > 0) {
               clover.transfer(recipient, balance);
            }

  }
}*/
}