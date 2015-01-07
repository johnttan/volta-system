var LocalAggregator = function(nsp){
  this.nsp = nsp;
  this.aggregations = {};
  this.aggregators = {};
};

LocalAggregator.prototype.report = function(key, value) {
  if(this.aggregations[key]){
    this.aggregators[key].forEach(function(agFunc){
      console.log(this.aggregations[key]);
      this.aggregations[key] = agFunc(value, this.aggregations[key]);
    }.bind(this));
  };
  this.nsp.emit('aggregations', this.aggregations);
};

LocalAggregator.prototype.register = function(key, aggregator, init){
  var that = this;
  if(!this.aggregations[key]){
    this.aggregations[key] = init;
    this.aggregators[key] = [aggregator];
  }else{
    that.aggregators[key].push(aggregator);
  };
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
