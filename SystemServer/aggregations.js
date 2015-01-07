var aggregations = [
  {
    key: 'consumers',
    aggregator: function(newValue, oldStructure){
      oldStructure.num ++;
      oldStructure.consumerIds[newValue.id] = {}
      return oldStructure;
    },
    init: {
      num: 0,
      consumerIds: {}
    }
  },
  {
    key: 'consumers',
    aggregator: function(newValue, oldStructure){
      oldStructure.num ++;
      oldStructure.consumerIds[newValue.id] = {}
      return oldStructure;
    },
    init: {
      num: 0,
      consumerIds: {}
    }
  }
];

module.exports = aggregations;
