var ProducerManager = function(config, market){
  this.config = config;
  this._producers = {};
  this._market = market;
};

ProducerManager.prototype.addProducer = function(producerId) {
  this._producers[producerId] = {};
};
// supply of form
// {
//   productionId: 12345,
//   pricePerMW: 1,
//   maxCapacity: 1,
//   minCapacity: 0.5
// }
ProducerManager.prototype.reportSupply = function(supply) {
  this._producers[bid.producerId].latestSupply = supply;
  this._market.bid(bid);
};

module.exports = ProducerManager;
