var aggregations = [
  {
    key: 'consumers',
    aggregator: function(newValue, oldStructure){
      oldStructure.num ++;
      oldStructure.ids[newValue.id] = {};
      return oldStructure;
    },
    init: {
      num: 0,
      ids: {}
    }
  },
  {
    key: 'producers',
    aggregator: function(newValue, oldStructure){
      oldStructure.num ++;
      oldStructure.ids[newValue.id] = {};
      return oldStructure;
    },
    init: {
      num: 0,
      ids: {},
      supply: {},
      controls: {}
    }
  },
  {
    key: 'producers.supply',
    aggregator: function(newValue, oldStructure){
      for(var id in newValue){
        oldStructure.supply[id] = oldStructure.supply[id] || [];
        oldStructure.supply[id].push(newValue[id]);
      };
      return oldStructure;
    }
  },
  {
    key: 'producers.controls',
    aggregator: function(controls, oldStructure){
      controls.forEach(function(control){
        oldStructure.controls[control.producerId] = oldStructure.controls[control.producerId] || [];
        oldStructure.controls[control.producerId].push(control);
      });
      return oldStructure;
    }
  },
  {
    key: 'brokers',
    aggregator: function(newValue, oldStructure){
      oldStructure.num ++;
      oldStructure.ids[newValue.id] = {
        quotes: []
      };
      return oldStructure;
    },
    init: {
      num: 0,
      ids: {}
    }
  },
  {
    key: 'brokers.quotes',
    aggregator: function(quote, oldStructure){
      oldStructure.ids[quote.id].quotes.push(quote);
      return oldStructure;
    }
  },
  {
    key: 'auctions',
    aggregator: function(newValue, oldStructure){
      oldStructure.auctions.push(newValue);
      return oldStructure;
    },
    init: {
      auctions: []
    }
  },
  {
    key: 'auctions.update',
    aggregator: function(newValue, oldStructure){
      oldStructure.auctions[oldStructure.auctions.length-1] = newValue;
      return oldStructure;
    }
  }
];

module.exports = aggregations;
