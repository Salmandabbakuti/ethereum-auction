const log = (message) => {
  $('#log').removeClass('error').text(message);
  console.log(message);
}
const error = (message) => $('#log').addClass('error').text(message);

const address = "0x016f641D4B48160E5c559cFE35B1188a0291DE4C";
const abi = [{ "inputs": [{ "internalType": "string", "name": "_productName", "type": "string" }, { "internalType": "string", "name": "_productDescription", "type": "string" }, { "internalType": "uint256", "name": "_biddingTime", "type": "uint256" }, { "internalType": "address payable", "name": "_beneficiary", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "winner", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AuctionEnded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "bidder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "HighestBidIncreased", "type": "event" }, { "inputs": [], "name": "bid", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "endAuction", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "endManually", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getProductDetails", "outputs": [{ "internalType": "string", "name": "_productName", "type": "string" }, { "internalType": "string", "name": "_productDescription", "type": "string" }, { "internalType": "string", "name": "_status", "type": "string" }, { "internalType": "uint256", "name": "_auctionStartTime", "type": "uint256" }, { "internalType": "uint256", "name": "_biddingTime", "type": "uint256" }, { "internalType": "uint256", "name": "_highestBid", "type": "uint256" }, { "internalType": "address", "name": "_highestBidder", "type": "address" }, { "internalType": "address", "name": "_beneficiary", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "payable", "type": "function" }];
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
  // Connect to the blockchain
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
    if (ethereum.networkVersion != 3) {
      // if network is not ropsten, try switching to ropsten
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3' }],
      }).catch((err) => {
        // add polygon mumbai network to metamask if not already added
        // if (err.code === 4902) {
        //   ethereum.request({
        //     method: 'wallet_addEthereumChain',
        //     params: [{ chainName: 'Polygon Mumbai', chainId: '0x13881', rpcUrls: ['https://rpc-mumbai.maticvigil.com/'] }]
        //   }).catch((err) => error(err.message));
        // } else {
        //   error(err.message);
        // }
        error(err.message);
      });

    }
    log("Connected to the Ropsten test network.");
    auction = new web3.eth.Contract(abi, address);
    auction.methods.getProductDetails().call().then((res) => {
      $('#getProductName').text(res._productName);
      $('#getProductDescription').text(res._productDescription);
      $('#getStatus').text(res._status);
      // getting the auction start time in unix timestamp to readable format
      $('#getAuctionStartTime').val(res._auctionStartTime).text(new Date(res._auctionStartTime * 1000));
      // Converting bidding time in unix timestamp to months
      $('#getBiddingTime').text(`${Math.ceil(res._biddingTime / 2628002.88)} Months`);
      // Converting highest bid in wei to ETH
      $('#getHighestBid').text(`${res._highestBid / 1e18} ETH`);
      $('#getHighestBidder').text(res._highestBidder);
      $('#getBeneficiary').text(res._beneficiary);
    }).catch((err) => error(err.message));
  } else {
    error("Unable to find web3. Please run MetaMask or something else that injects web3.");
  }

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
    auction.methods.endAuction().send({ from: web3.eth.defaultAccount }, (err, hash) => {
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
});
