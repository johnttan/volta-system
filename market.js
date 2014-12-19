var Market = function(config){
  this.config = config;
  this.events = {};
};


Market.prototype.on = function(event, cb){
  this.events[event] = this.events[event] || [];
  this.events[event].push(cb);
};

module.exports = Market;
