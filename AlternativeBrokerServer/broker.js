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
  this.marketNsp.on('connection', function(socket){
    this.addParticipant(socket);
  }.bind(this));
  this.systemClient.on('marketClose', this.collectDemandSupply.bind(this));
  this.systemClient.on('priceQuote', this.settleDemand.bind(this));

};

Broker.prototype.addParticipant = function(socket) {
  socket.on('demand', this.addDemand.bind(this));
  socket.on('supply', this.addSupply.bind(this));
};
Broker.prototype.addDemand = function(demand){
  this.demand[demand.consumerId] = demand;
};

Broker.prototype.addSupply = function(supply){
  this.supply[supply.producerId] = supply;
};

Broker.prototype.collectDemandSupply = function(timeBlock) {
  this.state = 1;
  this.timeBlock = timeBlock;
  this.marketNsp.emit('startCollection', timeBlock);
  setTimeout(function(){
    var demands = [];
    for(demand in this.demand){
      demands.push(this.demand[demand])
    };
    this.systemClient.emit('queryPrice', {demands:demands, timeBlock:timeBlock});
  }.bind(this), this.settlementTimePercentage * timeBlock.blockDuration);
};

Broker.prototype.settleDemand = function(quote){
  this.state = 2;
  // Figure out transactions here
  delete quote.controls;
  console.log(quote.price, 'quote');
  var totalDemand = 0;
  var totalSupply = 0;
  for(demand in this.demand){
    totalDemand += this.demand[demand].energy;
  };
  for(supply in this.supply){
    totalSupply += this.supply[supply].energy;
  };
  console.log('totals', totalDemand, totalSupply);
  this.demand = {};
  this.supply = {};

};


module.exports = Broker;
