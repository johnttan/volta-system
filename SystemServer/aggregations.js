var aggregations = [
  {
    key: 'consumers',
    aggregator: function(newValue, oldStructure){
      oldStructure.num ++;
      oldStructure.consumerIds[newValue.id] = {}
    },
    init: {
      num: 0,
      consumerIds: {}
    }
  }
];

module.exports = aggregations;
