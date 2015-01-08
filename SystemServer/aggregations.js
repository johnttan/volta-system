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
      supply: {},
      controls: {}
    }
  },
  {
    key: 'producers.supply',
    aggregator: function(newValue, oldStructure){
      oldStructure.supply = oldStructure.supply || [];
      oldStructure.supply.push(newValue);
      return oldStructure;
    }
  },
  {
    key: 'producers.controls',
    aggregator: function(controls, oldStructure){
      controls.forEach(function(control){
        oldStructure.controls[control.producerId] = oldStructure.controls[control.producerId] || [];
        oldStructure.ids[control.producerId].push(control);
      })
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
      auctions: [];
    }
  },
  {
    key: 'auctions.update',
    aggregator: function(newValue, oldStructure){
      oldStructure.auctions[oldStructure.auctions.length-1] = newValue;
      return oldStructure;
    },
    init: {
      auctions: [];
    }
  }
];

module.exports = aggregations;
