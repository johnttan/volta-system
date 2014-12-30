var Broker = function(config, marketNsp, systemClient){
  this.settlementTimePercentage = config.settlementTimePercentage;
  this.demand = {};
  this.supply = {};
  this.timeBlock = {};
  this.marketNsp = marketNsp;
  this.systemClient = systemClient;
  // State 0 = inactive;
  // State 1 = accepting demand/supply;
  // State 2 = settling transactions;
  this.state = 0;

  this.systemClient.on('marketClose', this.collectDemandSupply.bind(this));
  this.systemClient.on('queryQuote', this.settleDemand.bind(this));

};

Broker.prototype.addParticipant = function(socket) {
  socket.on('demand', this.addDemand.bind(this));
  socket.on('supply', this.addSupply.bind(this));
};
Broker.prototype.addDemand = function(demand){
  this.demand[demand.consumerId] = demand;
};

Broker.prototype.addSupply = function(supply){
  this.supply[demand.producerId] = supply;
};

Broker.prototype.collectDemandSupply = function(blockDuration) {
  this.state = 1;
  this.marketNsp.emit('startCollection');
  setTimeout(function(){
    this.systemClient.emit('queryPrice', this.demand);
  }.bind(this), this.settlementTimePercentage * blockDuration);
};

Broker.prototype.settleDemand = function(quote){

};


module.exports = Broker;
