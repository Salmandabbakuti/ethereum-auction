// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract SimpleAuction {
    address payable beneficiary;
    uint256 auctionStart;
    uint256 biddingTime;
    string productName;
    string productDescription;
    string status;
    address highestBidder;
    uint256 highestBid;
    bool ended;

    constructor(
        string memory _productName,
        string memory _productDescription,
        uint256 _biddingTime,
        address payable _beneficiary
    ) {
        beneficiary = _beneficiary;
        auctionStart = block.timestamp;
        biddingTime = _biddingTime;
        productName = _productName;
        status = "For Sale";
        productDescription = _productDescription;
    }

    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary);
        _;
    }
    mapping(address => uint256) pendingReturns;
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    function bid() public payable {
        if (block.timestamp > auctionStart + biddingTime)
            revert("Auction period has ended");
        if (ended) revert("Auction has ended");
        if (msg.value <= highestBid)
            revert("Bid must be higher than current highest bid");
        if (highestBidder != msg.sender) {
            pendingReturns[highestBidder] += highestBid;
        }
        if (highestBidder == msg.sender)
            revert("You are already highest bidder on this auction");
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw() public payable returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;
            payable(msg.sender).transfer(amount);
            return true;
        }
        return false;
    }

    function endAuction() public {
        if (block.timestamp <= auctionStart + biddingTime)
            revert("Auction period not ended yet");
        if (ended) revert("Auction ended already");
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);
        beneficiary.transfer(highestBid);
        status = "SoldOut";
    }

    function endManually() public payable onlyBeneficiary {
        if (ended) revert("Auction ended already");
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);
        status = "SoldOut";
        beneficiary.transfer(highestBid);
    }

    function getProductDetails()
        public
        view
        returns (
            string memory _productName,
            string memory _productDescription,
            string memory _status,
            uint256 _auctionStartTime,
            uint256 _biddingTime,
            uint256 _highestBid,
            address _highestBidder,
            address _beneficiary
        )
    {
        return (
            productName,
            productDescription,
            status,
            auctionStart,
            biddingTime,
            highestBid,
            highestBidder,
            beneficiary
        );
    }
}
