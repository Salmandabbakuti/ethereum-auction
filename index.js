 function log(message) {
    $('#log').append($('<p>').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function error(message) {
    $('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
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
  const address = "0x42544295c2757e249e937280f76be69e73e999af";
  const abi =[{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"auctionEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"auctionStart","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endManually","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"highestBidder","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"biddingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"highestBid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_biddingTime","type":"uint256"},{"name":"_beneficiary","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bidder","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"HighestBidIncreased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"AuctionEnded","type":"event"}];
  $(function () {
    var auction;
    $('#getowner').click(function (e) {
      e.preventDefault();
      auction.owner.call(function (err, result) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        $('#getowner').text(result.toString());
      });
    });
    $('#gethighestBidder').click(function (e) {
      e.preventDefault();
      auction.highestBidder.call(function (err, result) {
        if (err) {
          return error(err);
        }
        // The return value is a BigNumber object
        $('#gethighestBidder').text(result.toString());
      });
    });
    $('#getauctionStart').click(function (e) {
      e.preventDefault();
      auction.auctionStart.call(function (err, result) {
        if (err) {
          return error(err);
        }
        // The return value is a BigNumber object
        $('#getauctionStart').text(result.toString());
      });
    });
    $('#gettime').click(function (e) {
      e.preventDefault();
      log("Getting Data from Blockchain...");
      auction.biddingTime.call(function (err, result) {
        if (err) {
          return error(err);
        }
        // The return value is a BigNumber object
        $('#gettime').text(result.toString());
      });
    });
    $('#getbeneficiary').click(function (e) {
      e.preventDefault();
      auction.beneficiary.call(function (err, result) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        $('#getbeneficiary').text(result.toString());
      });
    });
    $('#gethighestBid').click(function (e) {
      e.preventDefault();
      auction.highestBid.call(function (err, result) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        $('#gethighestBid').text(result/(1000000000000000000)+" "+"ETH".toString());
      });
    });
    $('#withdraw').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      auction.withdraw.sendTransaction(function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    $('#bid').click( function (e) {
      e.preventDefault();
       if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On Its Way...");
      var bidTxObject = {
                    from:web3.eth.accounts[0],
                    value: window.web3.toWei(document.getElementById("bidAmount").value, "ether"),
                  };
                  log( "Placing bid...")
                   
      auction.bid.sendTransaction(bidTxObject, function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    if (typeof(web3) === "undefined") {
      error("Unable to find web3. " +
            "Please run MetaMask (or something else that injects web3).");
    } else {
      log("Found injected web3.");
      web3 = new Web3(web3.currentProvider);
      ethereum.enable();
      if (web3.version.network != 3) {
        error("Wrong network detected. Please switch to the Ropsten test network.");
      } else {
        log("Connected to the Ropsten test network.");
        auction = web3.eth.contract(abi).at(address);
        $('#getowner').click();
        $('#getauctionStart').click();
        $('#gethighestBidder').click();
        $('#gettime').click();
        $('#getbeneficiary').click();
        $('#gethighestBid').click();
        }
    }
  });
