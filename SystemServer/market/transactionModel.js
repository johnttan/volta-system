var Transaction = function(params){
  this.price = params.price;
  this.consumerId = params.consumerId;
  this.energy = params.energy;
  this.block = params.block;
  this.buyer = params.buyer;
  this.seller = params.seller;
};

module.exports = Transaction;
