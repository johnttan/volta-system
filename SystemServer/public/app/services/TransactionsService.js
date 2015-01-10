angular.module('app')
  .factory('TransactionsService', function(){
    var transactionsSocket = io('130.211.159.31/subscriptions');
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
      transactions: transactions,
      update: function(){},
      addUpdate: function(update){
        result.update = update;
      }
    };
    aggSocket.on('transaction', function(data){
      transactions.eq(data);
      result.update();
    });
    return result;
  })
