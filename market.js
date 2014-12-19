var nanot = require('nanotimer');

var Market = function(config){
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

Market.prototype.bid = function(bids) {
  var that = this;
  if(!this.currentAuction.bidders[bids.consumerId]
    && this.currentAuction.bids.length <= this.config.maxConsumers
    && bids.length <= this.config.maxNumBids
    ){
    bids.forEach(function(el){
      that.currentAuction.bids.push(el);
    });
    return true;
  }else{
    return false;
  }
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
