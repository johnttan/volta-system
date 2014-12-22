var PriceAndControl = function(config){
  this.currentModel = config.defaultPriceAndControl;
  this.models = {};
  var pathNames = fs.readdirSync('./pricingModels');
  pathNames.forEach(function(pathName){
    this.models[pathName] = require('./pricingModels/' + pathName);
  }.bind(this))
};

PriceAndControl.prototype.switchModel = function(modelName) {
  if(this.models[modelName]){
    this.currentModel = modelName;
  }else{
    throw new Error('No model named ' + modelName)
  }
};

module.exports = PriceAndControl;
