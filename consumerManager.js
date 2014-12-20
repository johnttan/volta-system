var ConsumerManager = function(config, market){
  this.config = config;
  this._consumers = {};
  this._market = market;
};

ConsumerManager.prototype.addConsumer = function(consumer) {
  consumer.on('bid', this.bid.bind(this));
  consumer.on('consume', function(consumption){
    console.log(consumption);
  });

  this._consumers[consumer.id] = {
    socket: consumer
  };
};

ConsumerManager.prototype.bid = function(bid) {
  var result = this._market.bid(bid);
  if(result){
    this._consumers[bid.consumerId].latestBid = bid;
  }
  return result;
};

module.exports = ConsumerManager;
