var _ = require('lodash');

var StreamingService = function(){
  this.subscriptions = {
    buyer: {},
    seller: {}
  }
};

StreamingService.prototype.addSubscription = function(key, subkey, socket){
  this.subscriptions[key] = this.subscriptions[key] || {subkey: {}};
  this.subscriptions[key][subkey] = this.subscriptions[key][subkey] || {};
  this.subscriptions[key][subkey][socket.id] = socket;
};

StreamingService.prototype.emitTransactions = function(transactions){
  _.each(transactions, function(transaction){
    this._notifySubscribers(transaction, 'buyer', transaction.buyer);
    this._notifySubscribers(transaction, 'seller', transaction.seller);
  }.bind(this))
};

StreamingService.prototype._notifySubscribers = function(transaction, key, id){
  if(this.subscriptions[key] && this.subscriptions[key][id]){
    _.each(this.subscriptions[key][id], function(socket){
      socket.emit('transaction', transaction);
    })
  }
};

module.exports = StreamingService;
