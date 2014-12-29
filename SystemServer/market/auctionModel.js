var Receipts = require('./receiptsModel');
var Transaction = require('./transactionModel');
var Auction = function(params){
  this.bidders = {};
  this.bids = [];
  this.results = {};
  this.receipts = new Receipts();
  if(params){
    for(key in this){
      if(params[key]){
        this[key] = params[key];
      }
    }
  }
};

Auction.prototype.addTransaction = function(params){
  var receipt = new Transaction(params);
  this.receipts.addTransaction(receipt);
};

Auction.prototype.save = function(){

};

Auction.prototype.getReceipts = function(){
  return this.receipts.getReceipts();
}
module.exports = Auction;
