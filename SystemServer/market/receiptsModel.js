var Receipts = function(){
  this.receipts = [];
};

Receipts.prototype.addTransaction = function(transaction){
  this.receipts.push(transaction);
};

Receipts.prototype.save = function(){

};

Receipts.prototype.getReceipts = function() {
  return this.receipts;
};
module.exports = Receipts;
