var consumerManager = function(config, market){
  this.config = config;
  this._consumers = {};
  this._market = market;
};

consumerManager.prototype.addConsumer = function(consumerId) {
  this._consumers[consumerId] = {};
};

consumerManager.prototype.bid = function(bid) {
  this._consumers[bid.consumerId].latestBid = bid;
  this._market.bid(bid);
};
