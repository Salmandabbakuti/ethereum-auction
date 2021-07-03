const log = (message) => {
  $('#log').removeClass('error').text(message);
  console.log(message);
}
const error = (message) => $('#log').addClass('error').text(message);

const address = "0xc1204Df1245C1c809918d13e6493215e4f68f8A7";
const abi = [{ "inputs": [{ "internalType": "string", "name": "_productName", "type": "string" }, { "internalType": "string", "name": "_productDescription", "type": "string" }, { "internalType": "uint256", "name": "_biddingTime", "type": "uint256" }, { "internalType": "address payable", "name": "_beneficiary", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "winner", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AuctionEnded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "bidder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "HighestBidIncreased", "type": "event" }, { "constant": false, "inputs": [], "name": "auctionEnd", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "auctionStart", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "beneficiary", "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "bid", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "biddingTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "endManually", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "highestBid", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "highestBidder", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "productDescription", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "productName", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "status", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
const waitForReceipt = (hash, cb) => {
  // txn.on('transactionHash', (hash) => {
  //   log('Transaction submitted successfully. waiting for confirmation')
  // })
  //   .on('confirmation', () => {
  //     log('Transaction Confirmed')
  //   })
  //   .on('error', (error) => {
  //     error('Transaction Failed', error.message)
  // });
  web3.eth.getTransactionReceipt(hash, (err, receipt) => {
    if (err) return error(err);
    if (!receipt) {
      // Try again in 1 second
      window.setTimeout(() => {
        waitForReceipt(hash, cb);
      }, 1000);
    } else {
      // Transaction went through
      if (!receipt.status) return error('Transaction Failed: Reverted By EVM')
      if (cb) cb(receipt);
    }
  })
}

$(document).ready(() => {
  //  smartcontract read methods
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

  // smartcontract transactions
  $('#withdraw').click((e) => {
    e.preventDefault();
    if (!web3.eth.defaultAccount) {
      return error("No accounts found. If you're using MetaMask, please unlock it first and reload the page.");
    }
    auction.methods.withdraw().send({ from: web3.eth.defaultAccount }, (err, hash) => {
      log('Transaction on its way..')
      if (err) return error(err.message);
      waitForReceipt(hash, () => {
        log("Transaction succeeded.");
      });
    })
  });
  $('#endAuction').click((e) => {
    e.preventDefault();
    if (!web3.eth.defaultAccount) return error("No accounts found. If you're using MetaMask, please unlock it first and reload the page.");
    auction.methods.auctionEnd().send({ from: web3.eth.defaultAccount }, (err, hash) => {
      log("Transaction On its Way...");
      if (err) return error(err.message);
      waitForReceipt(hash, () => {
        log("Transaction succeeded.");
      });
    });
  });
  $('#bid').click((e) => {
    e.preventDefault();
    if (!web3.eth.defaultAccount) return error("No accounts found. If you're using MetaMask, please unlock it first and reload the page.");
    const bidTxObject = {
      from: web3.eth.defaultAccount,
      value: web3.utils.toWei(document.getElementById("bidAmount").value, "ether"),
    };
    auction.methods.bid().send(bidTxObject, (err, hash) => {
      log("Transaction On its Way...");
      if (err) return error(err.message);
      waitForReceipt(hash, () => {
        log("Transaction succeeded.");
      });
    })
  });

  if (window.ethereum) {
    web3 = new Web3(ethereum);
    // ask metamask's permissions to access accounts and set default account
    ethereum.request({ method: 'eth_requestAccounts' }).then((res, err) => {
      if (err) return error(err);
      web3.eth.defaultAccount = res[0];
    });
    // handle network changes
    ethereum.on('chainChanged', () => window.location.reload());
    ethereum.on('accountsChanged', (accounts) => {
      web3.eth.defaultAccount = accounts[0];
    });
    if (ethereum.networkVersion != 3) return error("Wrong network detected. Please switch to the Ropsten test network.");
    log("Connected to the Ropsten test network.");
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
