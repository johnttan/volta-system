var StreamingService = function(){
  this.subscriptions = {
    buyer: {},
    seller: {}
  }
};

StreamingService.addSubscription = function(key, subkey, socket){
  this.subscriptions[key] = this.subscriptions[key] || {subkey: {}};
  this.subscriptions[key][subkey] = this.subscriptions[key][subkey] || {};
  this.subscriptions[key][subkey][socket.id] = socket;
};

StreamingService.emitTransactions = function(transactions){
  transactions.forEach(function(transaction){
    this._notifySubscribers(transaction, 'buyer', transaction.buyer);
    this._notifySubscribers(transaction, 'seller', transaction.seller);
  }.bind(this))
};

StreamingService._notifySubscribers = function(transaction, key, subkey){
  var id = transaction[key];
  if(this.subscriptions[key] && this.subscriptions[key][id]){
    this.subscriptions[key][id].forEach(function(socket){
      socket.emit('transaction', transaction);
    })
  }
};

module.exports = StreamingService;
