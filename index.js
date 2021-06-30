const log = (message) => {
  $('#log').removeClass('error').text(message);
  console.log(message);
}
const error = (message) => $('#log').addClass('error').text(message);

const address = "0xF70292d59041c6fE3E6Fb79F74b4cf7210Dc37fb";
const abi = [{ "constant": false, "inputs": [], "name": "bid", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "status", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "auctionEnd", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "beneficiary", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "auctionStart", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "endManually", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "productName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "productDescription", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "highestBidder", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "biddingTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "highestBid", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_productName", "type": "string" }, { "name": "_productDescription", "type": "string" }, { "name": "_biddingTime", "type": "uint256" }, { "name": "_beneficiary", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "bidder", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "HighestBidIncreased", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "winner", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "AuctionEnded", "type": "event" }];

const waitForReceipt = (hash, cb) => {
  web3.eth.getTransactionReceipt(hash, (err, receipt) => {
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
      window.setTimeout(() => {
        waitForReceipt(hash, cb);
      }, 1000);
    }
  });
}

$(() => {
  $('#getProductName').click((e) => {
    e.preventDefault();
    auction.methods.productName().call((err, result) => {
      if (err) {
        return error(err.message);
      }
      $('#getProductName').text(result.toString());
    });
  });
  $('#getProductDescription').click((e) => {
    e.preventDefault();
    auction.methods.productDescription().call((err, result) => {
      if (err) {
        return error(err.message);
      }
      $('#getProductDescription').text(result.toString());
    });
  });
  $('#getStatus').click((e) => {
    e.preventDefault();
    auction.methods.status().call((err, result) => {
      if (err) {
        return error(err.message);
      }
      $('#getStatus').text(result.toString());
    });
  });
  $('#gethighestBidder').click((e) => {
    e.preventDefault();
    auction.methods.highestBidder().call((err, result) => {
      if (err) {
        return error(err.message);
      }
      $('#gethighestBidder').text(result.toString());
    });
  });
  $('#getauctionStart').click((e) => {
    e.preventDefault();
    auction.methods.auctionStart().call((err, result) => {
      if (err) {
        return error(err.message);
      }
      // converting period in seconds(should be converted into milli seconds) stored in contract to date
      $('#getauctionStart').val(result).text(new Date(result * 1000));
    });
  });
  $('#gettime').click((e) => {
    e.preventDefault();
    auction.methods.biddingTime().call((err, result) => {
      if (err) {
        return error(err.message);
      }
      console.log($('#getauctionStart').val(), result);
      // converting period in seconds stored in contract to months
      $('#gettime').text(`${Math.ceil(result / 2628002.88)} Months`);
    });
  });
  $('#getbeneficiary').click((e) => {
    e.preventDefault();
    auction.methods.beneficiary().call((err, result) => {
      if (err) {
        return error(err.message);
      }
      $('#getbeneficiary').text(result.toString());
    });
  });
  $('#gethighestBid').click((e) => {
    e.preventDefault();
    auction.methods.highestBid().call((err, result) => {
      if (err) {
        return error(err.message);
      }
      $('#gethighestBid').text(result / (1000000000000000000) + " " + "ETH".toString());
    });
  });
  $('#withdraw').click((e) => {
    e.preventDefault();
    if (!web3.eth.defaultAccount) {
      return error("No accounts found. If you're using MetaMask, please unlock it first and reload the page.");
    }
    auction.methods.withdraw().send({ from: web3.eth.defaultAccount })
      .on('transactionHash', (hash) => {
        log('Transaction submitted successfully. waiting for confirmation')
      })
      .on('receipt', (receipt) => {
        console.log(receipt)
      })
      .on('confirmation', () => {
        log('Transaction Confirmed')
      })
      .on('error', (err) => {
        error('Transaction Failed:', err.message)
      });
  });
  $('#endAuction').click((e) => {
    e.preventDefault();
    if (web3.eth.defaultAccount === undefined) {
      return error("No accounts found. If you're using MetaMask, " +
        "please unlock it first and reload the page.");
    }
    log("Transaction On its Way...");
    auction.methods.auctionEnd.send((err, hash) => {
      if (err) {
        return error(err.message);
      }
      waitForReceipt(hash, () => {
        log("Transaction succeeded.");
      });
    });
  });
  $('#bid').click((e) => {
    e.preventDefault();
    if (web3.eth.defaultAccount === undefined) {
      return error("No accounts found. If you're using MetaMask, " +
        "please unlock it first and reload the page.");
    }
    const bidTxObject = {
      from: web3.eth.defaultAccount,
      value: web3.utils.toWei(document.getElementById("bidAmount").value, "ether"),
    };
    auction.methods.bid().send(bidTxObject)
      .on('transactionHash', (hash) => {
        log('Transaction submitted successfully. waiting for confirmation')
      })
      .on('receipt', (receipt) => {
        console.log(receipt)
      })
      .on('confirmation', () => {
        log('Transaction Confirmed')
      })
      .on('error', (err) => {
        error('Transaction Failed:', err)
      });
  });

  if (window.ethereum) {
    web3 = new Web3(web3.currentProvider);
    ethereum.enable();
    if (ethereum.networkVersion != 3) return error("Wrong network detected. Please switch to the Ropsten test network.");
    log("Connected to the Ropsten test network.");
    ethereum.request({ method: 'eth_requestAccounts' }).then((res, err) => {
      if (err) return error(err);
      web3.eth.defaultAccount = ethereum.selectedAddress;
    });
    auction = new web3.eth.Contract(abi, address);
    $('#getauctionStart').click();
    $('#gethighestBidder').click();
    $('#gettime').click();
    $('#getbeneficiary').click();
    $('#gethighestBid').click();
    $('#getStatus').click();
    $('#getProductName').click();
    $('#getProductDescription').click();
  } else {
    error("Unable to find web3. Please run MetaMask (or something else that injects web3).");
  }
});
