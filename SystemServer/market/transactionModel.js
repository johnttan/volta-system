var Transaction = function(params){
  this.price = params.price;
  this.consumerId = params.consumerId;
  this.energy = params.energy;
  this.block = params.block;
};

module.exports = Transaction;
