var cassandra = require('cassandra-driver');

var Transactions = function(config){
  this.config = config;
  this.client = new cassandra.Client({contactPoints: [this.config.cassIp], keyspace:this.config.cassKeyspace});
};

Transactions.prototype.commit = function(transactions) {
  var queryOptions = {consistency: cassandra.types.consistencies.quorum};
  var query = 'INSERT INTO transactions (price, consumerId, energy, blockStart, blockDuration) VALUES (?, ?, ?, ?, ?)';
  var queries = [];
  transactions.forEach(function(transaction){
    queries.push({
      query: query,
      params: [transaction.price, transaction.consumerId, transaction.energy, transaction.block.blockStart, transaction.block.blockDuration]
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

module.exports = Transactions;
