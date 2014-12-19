var producerManager = function(config, market){
  this.config = config;
  this._producers = {};
  this._market = market;
};

producerManager.prototype.addProducer = function(producerId) {
  this._producers[producerId] = {};
};
// supply of form
// {
//   productionId: 12345,
//   pricePerMW: 1,
//   maxCapacity: 1,
//   minCapacity: 0.5
// }
producerManager.prototype.reportSupply = function(supply) {
  this._producers[bid.producerId].latestSupply = supply;
  this._market.bid(bid);
};
