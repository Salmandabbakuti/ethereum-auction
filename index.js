function log(message) {
  $('#log').removeClass('error').text(message);
  console.log(message);
}
function error(message) {
  $('#log').addClass('error').text(message);
}
function waitForReceipt(hash, cb) {
  web3.eth.getTransactionReceipt(hash, function (err, receipt) {
    if (err) {
      error(err);
    }
    if (receipt !== null) {
      // Transaction went through
      if (cb) {
        cb(receipt);
      }
    } else {
      // Try again in 1 second
      window.setTimeout(function () {
        waitForReceipt(hash, cb);
      }, 1000);
    }
  });
}
const address = "0xF70292d59041c6fE3E6Fb79F74b4cf7210Dc37fb";
const abi = [{ "constant": false, "inputs": [], "name": "bid", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "status", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "auctionEnd", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "beneficiary", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "auctionStart", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "endManually", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "productName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "productDescription", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "highestBidder", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "biddingTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "highestBid", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_productName", "type": "string" }, { "name": "_productDescription", "type": "string" }, { "name": "_biddingTime", "type": "uint256" }, { "name": "_beneficiary", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "bidder", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "HighestBidIncreased", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "winner", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "AuctionEnded", "type": "event" }];
$(function () {
  var auction;
  $('#getProductName').click(function (e) {
    e.preventDefault();
    auction.productName.call(function (err, result) {
      if (err) {
        return error(err.message);
      }
      // The return value is a BigNumber object
      $('#getProductName').text(result.toString());
    });
  });
  $('#getProductDescription').click(function (e) {
    e.preventDefault();
    auction.productDescription.call(function (err, result) {
      if (err) {
        return error(err.message);
      }
      // The return value is a BigNumber object
      $('#getProductDescription').text(result.toString());
    });
  });
  $('#getStatus').click(function (e) {
    e.preventDefault();
    auction.status.call(function (err, result) {
      if (err) {
        return error(err.message);
      }
      // The return value is a BigNumber object
      $('#getStatus').text(result.toString());
    });
  });
  $('#gethighestBidder').click(function (e) {
    e.preventDefault();
    auction.highestBidder.call(function (err, result) {
      if (err) {
        return error(err.message);
      }
      // The return value is a BigNumber object
      $('#gethighestBidder').text(result.toString());
    });
  });
  $('#getauctionStart').click(function (e) {
    e.preventDefault();
    auction.auctionStart.call(function (err, result) {
      if (err) {
        return error(err.message);
      }
      // The return value is a BigNumber object
      $('#getauctionStart').text(result.toString());
    });
  });
  $('#gettime').click(function (e) {
    e.preventDefault();
    auction.biddingTime.call(function (err, result) {
      if (err) {
        return error(err.message);
      }
      // The return value is a BigNumber object
      $('#gettime').text(result.toString());
    });
  });
  $('#getbeneficiary').click(function (e) {
    e.preventDefault();
    auction.beneficiary.call(function (err, result) {
      if (err) {
        return error(err.message);
      }
      // The return value is a BigNumber object
      $('#getbeneficiary').text(result.toString());
    });
  });
  $('#gethighestBid').click(function (e) {
    e.preventDefault();
    auction.highestBid.call(function (err, result) {
      if (err) {
        return error(err.message);
      }
      // The return value is a BigNumber object
      $('#gethighestBid').text(result / (1000000000000000000) + " " + "ETH".toString());
    });
  });
  $('#withdraw').click(function (e) {
    e.preventDefault();
    if (web3.eth.defaultAccount === undefined) {
      return error("No accounts found. If you're using MetaMask, " +
        "please unlock it first and reload the page.");
    }
    log("Transaction On its Way...");
    auction.withdraw.sendTransaction(function (err, hash) {
      if (err) {
        return error(err.message);
      }
      waitForReceipt(hash, function () {
        log("Transaction succeeded.");
      });
    });
  });
  $('#endAuction').click(function (e) {
    e.preventDefault();
    if (web3.eth.defaultAccount === undefined) {
      return error("No accounts found. If you're using MetaMask, " +
        "please unlock it first and reload the page.");
    }
    log("Transaction On its Way...");
    auction.auctionEnd.sendTransaction(function (err, hash) {
      if (err) {
        return error(err.message);
      }
      waitForReceipt(hash, function () {
        log("Transaction succeeded.");
      });
    });
  });
  $('#bid').click(function (e) {
    e.preventDefault();
    if (web3.eth.defaultAccount === undefined) {
      return error("No accounts found. If you're using MetaMask, " +
        "please unlock it first and reload the page.");
    }
    log("Transaction On Its Way...");
    var bidTxObject = {
      from: web3.eth.accounts[0],
      value: window.web3.toWei(document.getElementById("bidAmount").value, "ether"),
    };
    log("Placing bid...")

    auction.bid.sendTransaction(bidTxObject, function (err, hash) {
      if (err) {
        return error(err.message);
      }
      waitForReceipt(hash, function () {
        log("Transaction succeeded.");
      });
    });
  });
  if (typeof (web3) === "undefined") {
    error("Unable to find web3. " +
      "Please run MetaMask (or something else that injects web3).");
  } else {
    log("Found injected web3.");
    web3 = new Web3(web3.currentProvider);
    ethereum.enable();
    console.log('Network:', web3.version.network)
    if (web3.version.network !== '3') {
      error("Wrong network detected. Please switch to the Ropsten test network.");
    } else {
      log("Connected to the Ropsten test network.");
      web3.eth.defaultAccount = web3.eth.accounts[0];
      auction = web3.eth.contract(abi).at(address);
      $('#getauctionStart').click();
      $('#gethighestBidder').click();
      $('#gettime').click();
      $('#getbeneficiary').click();
      $('#gethighestBid').click();
      $('#getStatus').click();
      $('#getProductName').click();
      $('#getProductDescription').click();
    }
  }
});
