var Receipts = require(__dirname + '/../SystemServer/market/receiptsModel');
var Transaction = require(__dirname + '/../SystemServer/market/transactionModel');
var config = require(__dirname + '/config')[process.env.node_env];
var CircularBuffer = require(__dirname + '/../utils/circularBuffer');

var Broker = function(config, marketNsp, systemClient){
  this.settlementTimePercentage = config.settlementTimePercentage;
  this.demand = {};
  this.supply = {};
  this.timeBlock = {};
  this.totalSales = 0;
  this.salesDelta = 0;
  this.deltaBuffer = new CircularBuffer(20);
  this.marketNsp = marketNsp;
  this.systemClient = systemClient;
  // State 0 = inactive;
  // State 1 = accepting demand/supply;
  // State 2 = settling transactions;
  this.state = 0;
  this.marketNsp.on('connection', function(socket){
    console.log('NEW CONNECTION');
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
  console.log('market closed', Date())
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
  if(!quote.price){
    quote.price = quote.minPrice;
  };
  console.log(quote.price, 'quote');
  var receipts = new Receipts();
  var totalDemand = 0;
  var totalSupply = 0;
  for(demand in this.demand){
    totalDemand += this.demand[demand].energy;
  };
  for(supply in this.supply){
    totalSupply += this.supply[supply].energy;
  };
  console.log(quote.price + quote.price * config.brokerFeePercent, 'plus broker fee');
  if(totalSupply === totalDemand){
    for(demand in this.demand){
      receipts.addTransaction(new Transaction({
        price: quote.price * config.discountPercent,
        energy: this.demand[demand].energy,
        block: quote.timeBlock,
        buyer: this.demand[demand].consumerId,
        seller: 'AEB'
      }))
    };
    for(supply in this.supply){
      receipts.addTransaction(new Transaction({
        price: (quote.price * config.discountPercent) - ((quote.price * config.discountPercent) * config.brokerFeePercent),
        energy: this.supply[supply].energy,
        block: quote.timeBlock,
        seller: this.supply[supply].producerId,
        buyer: 'AEB'
      }))
    }
  }else if(totalSupply > totalDemand){
    for(demand in this.demand){
      receipts.addTransaction(new Transaction({
        price: quote.price * config.discountPercent,
        energy: this.demand[demand].energy,
        block: quote.timeBlock,
        buyer: this.demand[demand].consumerId,
        seller: 'AEB'
      }))
    };
    for(supply in this.supply){
      receipts.addTransaction(new Transaction({
        price: (quote.price * config.discountPercent) - ((quote.price * config.discountPercent) * config.brokerFeePercent),
        energy: totalDemand * this.supply[supply].energy / totalSupply,
        block: quote.timeBlock,
        seller: this.supply[supply].producerId,
        buyer: 'AEB'
      }))
    }
  }else{
   for(demand in this.demand){
     receipts.addTransaction(new Transaction({
       price: quote.price * config.discountPercent,
       energy: totalSupply * this.demand[demand].energy / totalDemand,
       block: quote.timeBlock,
       buyer: this.demand[demand].consumerId,
       seller: 'AEB'
     }))
   };
   for(supply in this.supply){
     receipts.addTransaction(new Transaction({
       price: (quote.price * config.discountPercent) - ((quote.price * config.discountPercent) * config.brokerFeePercent),
       energy: this.supply[supply].energy,
       block: quote.timeBlock,
       seller: this.supply[supply].producerId,
       buyer: 'AEB'
     }))
   }
  };

  receipts.receipts.forEach(function(receipt){
    if(receipt.seller === 'AEB'){
      var sale = receipt.price * receipt.energy * (receipt.block.blockDuration / 1000 / 60 / 60);
      var oldSales = this.totalSales;
      this.totalSales += sale;
      this.deltaSales = this.totalSales - oldSales;
      this.deltaBuffer.eq(this.deltaSales);
    }
  });

  this.systemClient.emit('aggregation', {
    totalSales: this.totalSales,
    deltaSales: this.deltaSales,
    deltaHistory: this.deltaBuffer.array,
    totalSupply: totalSupply,
    totalDemand: totalDemand
  });

  receipts.save();
  console.log('totals', totalDemand, totalSupply);
  this.demand = {};
  this.supply = {};

};


module.exports = Broker;
