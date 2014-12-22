var ConsumerManager = function(config, market){
  this.config = config;
  this._consumers = {};
  this._market = market;
  this._market.on('marketClose', function(receipts){
    receipts.forEach(function(receipt){
      this._consumers[receipt.consumerId].socket.emit('receipt', receipt)
    }.bind(this))
  }.bind(this));
};

ConsumerManager.prototype.addConsumer = function(consumer) {
  consumer.on('bid', this.bid.bind(this));
  consumer.on('consume', function(consumption){
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
