var NanoTimer = require('nanotimer');
var timer = new NanoTimer();
var priceAndControl = require('./priceAndControl');
var fileLog = require('./fileLog');

var Market = function(config){
  /*
  state = 0 non-active
  state = 1 bidding
  state = 2 within time block
  */
  this.state = 0;
  this.config = config;
  this.events = {};
  this.runningStats = {};
  this.currentBids = {};
  this.currentAuction = {
    bidders: {},
    bids: [],
    results: {},
    receipts: []
  };
  this.previousAuction = {};
  this.currentSupply = {};
  reporter.register('previousAuctionBids', function(){return this.previousAuction.bids}.bind(this));
  reporter.register('previousAuctionBidders', function(){return this.previousAuction.bidders}.bind(this));
  reporter.register('previousAuctionResults', function(){return this.previousAuction.results}.bind(this));
  reporter.register('previousAuctionReceipts', function(){return this.previousAuction.receipts}.bind(this));
};

/*
Process a bid from 1 consumer
*/
Market.prototype.bid = function(bids) {
  var that = this;
  if(
    this.state === 1
    && !this.currentAuction.bidders[bids.consumerId]
    && this.currentAuction.bids.length <= this.config.maxConsumers
    && bids.data.length <= this.config.maxNumBids
  ){
    this.currentAuction.bidders[bids.consumerId] = bids.data;
    bids.data.forEach(function(el){
      that.currentAuction.bids.push([el.price, el.energy]);
    });
    return true;
  }else{
    return false;
  }
};

/*
Process a supply report from 1 producer
*/
Market.prototype.reportSupply = function(supply) {
  this.currentSupply[supply.producerId] = supply;
  return true;
};

/*
Start Market cycle
startMarket ->
  _startBids -> _clearMarket -> startBids .....
*/
Market.prototype.startMarket = function() {
  this._startBids();
};

/*
Bidding loop
*/
Market.prototype._startBids = function() {
  this.state = 1;
  this.currentBlock = {
    blockStart: Date.now(),
    blockDuration: this.config.blockDuration,
    minPrice: this.config.minPrice,
    maxPrice: this.config.maxPrice,
    biddingDuration: this.config.biddingDuration
  };
  this.currentAuction.currentBlock = this.currentBlock;
  this.trigger('startBidding', this.currentBlock);
  timer.setTimeout(this._clearMarket.bind(this), null, this.config.biddingDuration.toString() + 'm');
};

/*
Clear the market and setTimeout for next bidding cycle
*/
Market.prototype._clearMarket = function() {
  try{
    var results = priceAndControl(this.currentAuction.bids, this.currentSupply, this.config.margin, this.config.blockDuration);
    var receipts = [];
    for(bidder in this.currentAuction.bidders){
        receipts.push({
          price: results.price,
          consumerId: bidder,
          block: this.currentBlock
        })
    };
    this.currentAuction.receipts = receipts;
    this.currentAuction.results = results;
    this.state = 2;
    this.trigger('marketClose', receipts);
    this.trigger('changeProduction', results.controls);
    this.previousAuction = this.currentAuction;
    // DRY this
    this.currentAuction = {
      bidders: {},
      bids: [],
      results: {},
      receipts: []
    };
  }catch(e){
    console.log(e);
    this.trigger('error', e);
  };

  timer.setTimeout(this._startBids.bind(this), null, this.config.blockDuration.toString() + 'm');
};

/*
Register callback to receive data
*/
Market.prototype.on = function(event, cb){
  if(cb && event){
    this.events[event] = this.events[event] || [];
    this.events[event].push(cb);
  }
};

Market.prototype.trigger = function(event, data){
  var reportedData = JSON.parse(JSON.stringify(data));
  if(event === 'startBidding'){
    console.log(reportedData)
  };
  reporter.report(event, function(){return reportedData});
  fileLog(this);
  if(this.events[event]){
    this.events[event].forEach(function(el){
      el(data);
    })
  }
};

module.exports = Market;
