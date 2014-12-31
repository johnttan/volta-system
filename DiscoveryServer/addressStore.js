var mongoose = require('mongoose');
var models = require('./addressStoreModels').models;

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

AddressStore.prototype.register = function(opts, cb) {
  if(models[opts.role]){
    var newModel = new models[opts.role](opts);
    newModel.save(function(err, newDoc){
      if(err){
        cb(err);
      }else{
        cb();
      }
    })
  }else{
    cb(err);
  }
};

module.exports = AddressStore;
