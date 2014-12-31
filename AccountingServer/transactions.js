var cassandra = require('cassandra-driver');
var repl = require('repl');
var Transactions = function(config){
  this.config = config;
  this.client = new cassandra.Client({contactPoints: [this.config.cassIp], keyspace:this.config.cassKeyspace});
};

Transactions.prototype.commit = function(transactions) {
  var queryOptions = {
    prepare: true
  };
  var query = 'INSERT INTO transactions (price, consumerId, energy, blockStart, blockDuration, transactionId, buyer, seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  var queries = [];
  transactions.forEach(function(transaction){
    queries.push({
      query: query,
      params: [transaction.price, transaction.consumerId, transaction.energy, transaction.block.blockStart, transaction.block.blockDuration, transaction.transactionId, transaction.buyer, transaction.seller]
    })
  });
  this.client.batch(queries, queryOptions, function(err){
    if(err){
      console.log('err committing', err);
    }
  })
};

Transactions.prototype.getLatest = function(cb){
  this.client.execute('SELECT * FROM transactions', [], function(err, result){
    if(err){
      console.log('err getLatest', err);
    }else{
      cb(result.rows);
    }
  })
};

Transactions.prototype.getByConsumer = function(id, cb){
  this.client.execute('SELECT * FROM transactions WHERE consumerId=?', [id], function(err, result){
    if(err){
      console.log('err getByConsumer', err);
    }else{
      cb(result.rows);
    }
  })
};

module.exports = Transactions;
// NEEDS SECONDARY INDEXES on consumerId
// var config = require('./config').development;
// var test = new Transactions(config);
// test.commit([{transactionId: '23sfadsf234', price: 23, consumerId: '2', energy: 10, block:{blockStart: 1, blockDuration: 1}}, {transactionId: '34', price: 23, consumerId: '2', energy: 10, block:{blockStart: 1, blockDuration: 1}}])
// test.getLatest(function(data){
//   console.log(data);
// })
// test.getByConsumer('2', function(data){
//   console.log(data);
// });
// repl.start('>').context.Transactions = Transactions;
