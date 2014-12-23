var fs = require('fs');

var PriceAndControl = function(config){
  this.currentModel = config.defaultPriceAndControl;
  this.models = {};
  var pathNames = fs.readdirSync('./pricingModels');
  pathNames.forEach(function(pathName){
    this.models[pathName.slice(0, -3)] = require('./pricingModels/' + pathName);
  }.bind(this))
};

PriceAndControl.prototype.switchModel = function(modelName) {
  if(this.models[modelName]){
    this.currentModel = modelName;
  }else{
    throw new Error('No model named ' + modelName)
  }
};

PriceAndControl.prototype.compute = function(){
  return this.models[this.currentModel].apply(this, arguments);
};
module.exports = PriceAndControl;
