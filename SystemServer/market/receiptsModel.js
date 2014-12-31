var request = require('request');

var Receipts = function(){
  this.receipts = [];
};

Receipts.prototype.addTransaction = function(transaction){
  this.receipts.push(transaction);
};

Receipts.prototype.save = function(){
  request.post({
    // Get url from config or elsewhere instead of hardcoded
    url: 'http://localhost:8010/api/transactions',
    json: true,
    body: this.receipts
  }, function(err, resp, body){
    if(err){
      console.log('err saving receipts', err);
    }
  });
};

Receipts.prototype.getReceipts = function() {
  return this.receipts;
};
module.exports = Receipts;
// var test = new Receipts();

// setInterval(function(){
//   test.receipts = [{transactionId: Math.random().toString(36), price: 23, consumerId: '2', energy: 10, block:{blockStart: 1, blockDuration: 1}}, {transactionId: 'TEST2', price: 23, consumerId: '2', energy: 10, block:{blockStart: 1, blockDuration: 1}}];
//   test.save();
// }, 1000)

// Schema
// cqlsh:volta> CREATE TABLE volta.transactions (
//          ... price double,
//          ... consumerId text,
//          ... energy double,
//          ... blockStart double,
//          ... blockDuration double,
//          ... transactionId text PRIMARY KEY,
//          ... buyer text,
//          ... seller text
//          ... );

