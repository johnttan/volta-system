var LocalAggregator = function(nsp){
  this.nsp = nsp;
  this.aggregations = {};
};

LocalAggregator.prototype.report = function(key, value) {
  this.nsp.emit(key, value);
  if(this.aggregations[key]){
    this.aggregations[key].aggregate(value);
  }
};

LocalAggregator.prototype.register = function(key, aggregator){
  var aggregatorObject = {
    value: undefined,
    aggregate: function(value){
      // new, old
      aggregatorObject.value = aggregator(value, aggregatorObject.value)
    }
  };
  this.aggregations[key] = aggregatorObject;
};
