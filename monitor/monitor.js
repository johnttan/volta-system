var Monitor = function(config){
  this.config = config;
  this.deltas = {};
};

Monitor.prototype.consume = function(consumption, receipt) {
  this.deltas[receipt.consumerId] = this.deltas[receipt.consumerId] || {};
  var currentConsumer = this.deltas[receipt.consumerId];
  currentConsumer.currentConsumption = consumption.currentConsumption - receipt.energy;
};

module.exports = Monitor;
