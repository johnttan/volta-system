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
      transactionsArray: [],
      brokerSales: 0,
      brokerTransactions: new CircularBuffer(20),
      update: [],
      addUpdate: function(updater){
        result.update.push(updater);
      }
    };
    transactionsSocket.on('transaction', function(data){
      result.num ++;
      transactions.eq(data);
      result.transactionsArray = result.transactions.array.reverse();
      result.update.forEach(function(updater){
        if(updater){
          updater();
        }
      });
    });
    return result;
  })
