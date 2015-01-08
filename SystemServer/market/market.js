var NanoTimer = require('nanotimer');
var timer = new NanoTimer();
var PriceAndControl = require('./priceAndControl');
var Auction = require('./auctionModel');
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
  this.currentAuction = new Auction();
  this.priceAndControl = new PriceAndControl(config);
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
      that.currentAuction.bids.push({price: el.price, energy: el.energy});
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

Market.prototype.computeBasedOnDemand = function(demand){
  var results = this.priceAndControl.compute(demand, this.currentSupply, this.config.margin, this.config.blockDuration);
  return results;

};

/*
Clear the market and setTimeout for next bidding cycle
*/
Market.prototype._clearMarket = function() {
  try{
    var results = this.computeBasedOnDemand(this.currentAuction.bids);
    for(bidder in this.currentAuction.bidders){
      var currentBidder = this.currentAuction.bidders[bidder];
      var resolvedEnergy;
      currentBidder.sort(function(a, b){
        return a.price - b.price;
      });
      currentBidder.forEach(function(el, ind){
        if(el.price < results.price || !currentBidder[ind-1] || (currentBidder[ind-1].price > results.price)){
          resolvedEnergy = el.energy;
        }
      });
      this.currentAuction.addTransaction({
        price: results.price,
        consumerId: bidder,
        energy: resolvedEnergy,
        block: this.currentBlock,
        buyer: bidder,
        seller: 'grid'
      });
    };
    results.controls.forEach(function(producer){
      this.currentAuction.addTransaction({
        price: results.price,
        energy: producer.productionGoal,
        block: this.currentBlock,
        buyer: 'grid',
        seller: producer.producerId
      })
    }.bind(this));

    this.currentAuction.save();
    this.state = 2;
    this.currentAuction.currentBlock = this.currentBlock;
    this.trigger('marketClose', this.currentAuction);
    this.trigger('changeProduction', results.controls);
    this.currentAuction = new Auction();
    console.log('market closed')
  }catch(e){
    console.trace(e);
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
  if(data){
    var reportedData = JSON.parse(JSON.stringify(data));
  };
  reporter.report(event, function(){return reportedData});
  if(this.events[event]){
    this.events[event].forEach(function(el){
      el(data);
    })
  }
};

module.exports = Market;
