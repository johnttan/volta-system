var mongoose = require('mongoose');
var models = require('./addressStoreModels');

var AddressStore = function(config){
  this.state = 0;
  this.dbClient = mongoose;
  this.dbClient.connect(config.mongoIp);
  this.dbClient.connection.on('open', function(){
    this.state = 1;
  }.bind(this));
  this.dbClient.connection.on('error', function(){
    this.state = 2;
  }.bind(this));
};

AddressStore.prototype.getState = function() {
  return this.state;
};

module.exports = AddressStore;
