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
    bids: []
  };
  this.previousAuction = {};
  this.currentSupply = {};
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
  this.trigger('startBidding', {
    blockStart: Date.now(),
    blockDuration: this.config.blockDuration,
    minPrice: this.config.minPrice,
    maxPrice: this.config.maxPrice,
    biddingDuration: this.config.biddingDuration
  });
  timer.setTimeout(this._clearMarket.bind(this), null, this.config.biddingDuration.toString() + 'm');
};

/*
Clear the market and setTimeout for next bidding cycle
*/
Market.prototype._clearMarket = function() {
  var results = priceAndControl(this.currentAuction.bids, this.currentSupply, this.config.margin, this.config.blockDuration);
  var receipts = [];
  this.state = 2;
  this.trigger('marketClose', receipts);
  this.trigger('changeProduction', results.controls);
  this.previousAuction = this.currentAuction;
  // DRY this
  this.currentAuction = {
    bidders: {},
    bids: []
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
  console.log(event, fileLog(this));
  if(this.events[event]){
    this.events[event].forEach(function(el){
      el(data);
    })
  }
};

module.exports = Market;
