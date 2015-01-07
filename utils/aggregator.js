var LocalAggregator = function(nsp){
  this.nsp = nsp;
  this.aggregations = {};
  this.aggregators = {};
};

LocalAggregator.prototype.report = function(key, value) {
  if(this.aggregations[key]){
    this.aggregators[key].forEach(function(agFunc){
      agFunc(value);
    });
  };
  this.nsp.emit('aggregations', this.aggregations);
};

LocalAggregator.prototype.register = function(key, aggregator, init){
  var that = this;
  if(!this.aggregations[key]){
    var aggregatorObject = {
      value: init,
    };
    this.aggregations[key] = aggregatorObject;
    this.aggregators = [function(value){
        // new, old
        aggregatorObject.value = aggregator(value, aggregatorObject.value)
    }];
  }else{
    var aggFunc = function(value){
      that.aggregations[key].value = aggregator(value, that.aggregations[key].value);
    };
    this.aggregators[key].push(aggFunc);
  }
};

LocalAggregator.prototype.registerAll = function(list){
  list.forEach(function(aggregation){
    this.register(aggregation.key, aggregation.aggregator, aggregation.init)
  }.bind(this))
};

module.exports = LocalAggregator;
