var Market = function(config){
  this.config = config;
  this.events = {};
  this.runningStats = {};
};

Market.prototype.bid = function(bids) {

};
/*
Register callback to receive data
*/
Market.prototype.on = function(event, cb){
  this.events[event] = this.events[event] || [];
  this.events[event].push(cb);
};

Market.prototype.trigger = function(event, data){
  if(this.events[event]){
    this.events[event].forEach(function(el){
      el(data);
    })
  }
};
module.exports = Market;
