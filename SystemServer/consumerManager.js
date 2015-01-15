var ConsumerManager = function(config, market, monitor){
  this.config = config;
  this._monitor = monitor;
  this._consumers = {};
  this._market = market;
  this._market.on('marketClose', function(auction){
    var receipts = auction.getReceipts();
    receipts.forEach(function(receipt){
      if(receipt.consumerId){
        this._consumers[receipt.consumerId].socket.emit('receipt', receipt);
        this._consumers[receipt.consumerId].currentBlock = receipt;
      }
    }.bind(this))
  }.bind(this));
};

ConsumerManager.prototype.addConsumer = function(consumer) {
  aggregator.report('consumers', consumer);
  consumer.on('disconnect', function(){
    aggregator.report('consumers.disconnect')
  });
  consumer.on('bid', this.bid.bind(this));
  consumer.on('consume', function(consumption){
    if(this._consumers[consumer.id].currentBlock){
      this._monitor.consume(consumption, this._consumers[consumer.id].currentBlock);
    }
  }.bind(this));

  this._consumers[consumer.id] = {
    socket: consumer
  };
};

ConsumerManager.prototype.bid = function(bid) {
  var result = this._market.bid(bid);
  if(result){
    this._consumers[bid.consumerId].latestBid = bid;
  };
  return result;
};

ConsumerManager.prototype.getLatestBid = function(id) {
  return this._consumers[id].latestBid;
};
module.exports = ConsumerManager;
