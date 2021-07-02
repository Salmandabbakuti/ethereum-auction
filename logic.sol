pragma solidity ^0.5.1;

contract SimpleAuction {
  address payable public beneficiary;
  uint public auctionStart;
  uint public biddingTime;
  string public productName;
  string public  productDescription;
  string  public status;
  address public highestBidder;
  uint public highestBid;
  bool ended;
  
  constructor(string memory _productName, string memory _productDescription, uint _biddingTime,address payable _beneficiary) public {
    beneficiary = _beneficiary;
    auctionStart = now;
    biddingTime = _biddingTime;
    productName = _productName;
    status = "For Sale";
    productDescription = _productDescription;
  }

  mapping(address => uint) pendingReturns;
  event HighestBidIncreased(address bidder, uint amount);
  event AuctionEnded(address winner, uint amount);
  
  function bid() public payable {
    if (now > auctionStart + biddingTime) {
      revert();
        }
    if (ended){
      revert();
      }
    if (msg.value <= highestBid) {
      revert();
    }
    if (highestBidder != msg.sender) {
      pendingReturns[highestBidder] += highestBid;
    }
    if (highestBidder==msg.sender) {
        revert();
    }
    highestBidder = msg.sender;
    highestBid = msg.value;
   emit HighestBidIncreased(msg.sender, msg.value);
  }

  function withdraw() public returns (bool) {
    uint amount = pendingReturns[msg.sender];
    if (amount > 0) {
      pendingReturns[msg.sender] = 0;

      if (!msg.sender.send(amount)) {
        pendingReturns[msg.sender] = amount;
        return false;
      }
    }
    return true;
  }
  
  function auctionEnd() public {
    
    if (now <= auctionStart + biddingTime)
      revert();
    if (ended){
      revert();
      }
 
    ended = true;
    emit AuctionEnded(highestBidder, highestBid);
    beneficiary.transfer(highestBid);
    status ="SoldOut";
    
  }
  modifier onlyBeneficiary {
      require (msg.sender== beneficiary);
         _;
  }
  
  function endManually() public payable onlyBeneficiary {
       if (ended){
      revert();
       }
       ended = true;
    emit AuctionEnded(highestBidder, highestBid);
    status = "SoldOut";
    beneficiary.transfer(highestBid);
  }
      
  }
