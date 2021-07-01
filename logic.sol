pragma solidity ^0.5.0;

contract SimpleAuction {
  address public owner;
  address payable public beneficiary;
  uint public auctionStart;
  uint public biddingTime;

  // Current state of the auction.
  address public highestBidder;
  uint public highestBid;

  // Allowed withdrawals of previous bids
  mapping(address => uint) pendingReturns;

  // Set to true at the end, disallows any change
  bool ended;

  // Events that will be fired on changes.
  event HighestBidIncreased(address bidder, uint amount);
  event AuctionEnded(address winner, uint amount);
  constructor(uint _biddingTime,address payable _beneficiary) public {
    beneficiary = _beneficiary;
    auctionStart = now;
    biddingTime = _biddingTime;
    owner = msg.sender;
  }

  /// Bid on the auction with the value sent
  /// together with this transaction.
  /// The value will only be refunded if the
  /// auction is not won.
  function bid() public payable {
    if (now > auctionStart + biddingTime) {
      // Revert the call if the bidding
      // period is over.
      revert();
    }
    if (msg.value <= highestBid) {
      // If the bid is not higher, send the
      // money back.
      revert();
    }
    if (highestBidder != msg.sender) {
      pendingReturns[highestBidder] += highestBid;
    }
    highestBidder = msg.sender;
    highestBid = msg.value;
   emit HighestBidIncreased(msg.sender, msg.value);
  }

  /// Withdraw a bid that was overbid.
  function withdraw() public returns (bool) {
    uint amount = pendingReturns[msg.sender];
    if (amount > 0) {
      pendingReturns[msg.sender] = 0;

      if (!msg.sender.send(amount)) {
        // No need to call throw here, just reset the amount owing
        pendingReturns[msg.sender] = amount;
        return false;
      }
    }
    return true;
  }

  /// End the auction and send the highest bid
  /// to the beneficiary.
  function auctionEnd() public {
    // 1. Conditions
    if (now <= auctionStart + biddingTime)
      revert(); // auction did not yet end
    if (ended)
      revert(); // this function has already been called

    // 2. Effects
    ended = true;
    emit AuctionEnded(highestBidder, highestBid);
    beneficiary.transfer(highestBid);
  }
  modifier onlyOwner{
      require(msg.sender == owner);
      _;
  }
  modifier onlyBeneficiary {
      require (msg.sender== beneficiary);
         _;
  }
  
  function endManually() public onlyOwner onlyBeneficiary {
      
      ended = true;
    emit AuctionEnded(highestBidder, highestBid);
    beneficiary.transfer(highestBid);
  }
      
  }
