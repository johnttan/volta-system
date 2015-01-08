var stringify = require('json-stringify-safe');

var LocalAggregator = function(nsp){
  this.nsp = nsp;
  this.aggregations = {};
  this.aggregators = {};
  nsp.on('connect', function(socket){
    socket.emit('aggregations', this.aggregations)
  });
};

LocalAggregator.prototype.report = function(key, value) {
  value = JSON.parse(stringify(value));
  var dataKey = key.split('.')[0];
  console.log(key, value);
  if(this.aggregators[key]){
    this.aggregators[key].forEach(function(agFunc){
      this.aggregations[dataKey] = agFunc(value, this.aggregations[dataKey]);
    }.bind(this));
  };
  this.nsp.emit('aggregations', this.aggregations);
};

LocalAggregator.prototype.register = function(key, aggregator, init){
  var that = this;
  if(!this.aggregators[key]){
    this.aggregators[key] = [aggregator];
  }else{
    that.aggregators[key].push(aggregator);
  }
  if(!this.aggregations[key.split('.')[0]]){
    this.aggregations[key.split('.')[0]] = init;
  }
};

LocalAggregator.prototype.registerAll = function(list){
  list.forEach(function(aggregation){
    this.register(aggregation.key, aggregation.aggregator, aggregation.init)
  }.bind(this))
};

module.exports = LocalAggregator;

// var testNsp = {
//   emit: function(event, value){
//     console.log('emittedNsp', event);
//     console.dir(value.consumers);
//   }
// };
// var testAggregations = require('../SystemServer/aggregations');
// var testAgg = new LocalAggregator(testNsp);
// testAgg.registerAll(testAggregations);
// testAgg.report('consumers', {
//   id: 1
// })
