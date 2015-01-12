angular.module('app')
  .factory('TransactionsService', function(){
    var transactionsSocket = io('130.211.159.31:80/subscriptions');
    transactionsSocket.emit('subscribe', {
      key: 'buyer',
      subkey: 'AEB'
    });
    transactionsSocket.emit('subscribe', {
      key: 'seller',
      subkey: 'AEB'
    });
    transactionsSocket.emit('subscribe', {
      key: 'buyer',
      subkey: 'grid'
    });
    transactionsSocket.emit('subscribe', {
      key: 'seller',
      subkey: 'grid'
    });
    var transactions = new CircularBuffer(200);
    var result = {
      num: 0,
      transactions: transactions,
      brokerSales: 0,
      brokerTransactions: new CircularBuffer(20),
      update: function(){},
      addUpdate: function(update){
        result.update = update;
      }
    };
    transactionsSocket.on('transaction', function(data){
      result.num ++;
      transactions.eq(data);
      result.update();
    });
    return result;
  })
