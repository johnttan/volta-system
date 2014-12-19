var NanoTimer = require('nanotimer');
var priceAndControl = require('./priceAndControl');

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
    bids: []
  };
  this.previousAuction = {};
};

/*
Process a bid from 1 consumer
*/
Market.prototype.bid = function(bids) {
  var that = this;
  if(
    !this.currentAuction.bidders[bids.consumerId]
    && this.currentAuction.bids.length <= this.config.maxConsumers
    && bids.length <= this.config.maxNumBids
  ){
    this.currentAuction.bidders[bids.consumerId] = bids;
    bids.forEach(function(el){
      that.currentAuction.bids.push([el.price, el.energy]);
    });
    return true;
  }else{
    return false;
  }
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
  this.trigger('startBidding', {
    blockStart: Date.now(),
    blockDuration: this.config.blockDuration,
    minPrice: this.config.minPrice,
    maxPrice: this.config.maxPrice,
    biddingDuration: this.config.biddingDuration
  });

  var timer = new NanoTimer();
  timer.setTimeout(this._clearMarket.bind(this), this.config.biddingDuration.toString() + 'ms');
};

/*
Clear the market and setTimeout for next bidding cycle
*/
Market.prototype._clearMarket = function() {
  var results = priceAndControl(this.currentAuction.bids, this.supply);
  this.state = 2;
  this.trigger('marketClose', receipts);
  this.trigger('changeProduction', results.controls);
};

/*
Register callback to receive data
*/
Market.prototype.on = function(event, cb){
  this.events[event] = this.events[event] || [];
  this.events[event].push(cb);
};

Market.prototype.trigger = function(event, data){
  if(this.events[event]){
    this.events[event].forEach(function(el){
      el(data);
    })
  }
};

module.exports = Market;
