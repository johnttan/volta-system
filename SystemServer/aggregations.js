var CircularBuffer = require(__dirname + '/../utils/circularBuffer');

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
    key: 'consumers.disconnect',
    aggregator: function(newValue, oldStructure){
      oldStructure.num --;
      if(oldStructure.ids[newValue]){
        delete oldStructure.ids[newValue]
      };
      return oldStructure;
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
    key: 'producers.disconnect',
    aggregator: function(newValue, oldStructure){
      oldStructure.num --;
      if(oldStructure.supply[newValue]){
        delete oldStructure.supply[newValue];
        delete oldStructure.ids[newValue];
        delete oldStructure.controls[newValue];
      };
      return oldStructure;
    }
  },
  {
    key: 'producers.supply',
    aggregator: function(newValue, oldStructure){
      for(var id in newValue){
        oldStructure.supply[id] = oldStructure.supply[id] || new CircularBuffer(100);
        oldStructure.supply[id].eq(newValue[id]);
      };
      return oldStructure;
    }
  },
  {
    key: 'producers.controls',
    aggregator: function(controls, oldStructure){
      controls.forEach(function(control){
        oldStructure.controls[control.producerId] = oldStructure.controls[control.producerId] || new CircularBuffer(100);
        oldStructure.controls[control.producerId].eq(control);
      });
      return oldStructure;
    }
  },
  {
    key: 'brokers',
    aggregator: function(newValue, oldStructure){
      oldStructure.num ++;
      oldStructure.ids[newValue.id] = {
        quotes: new CircularBuffer(100)
      };
      return oldStructure;
    },
    init: {
      num: 0,
      ids: {}
    }
  },
  {
    key: 'brokers.auctions',
    aggregator: function(newValue, oldStructure){
      oldStructure.auctions = newValue;
      return oldStructure;
    }
  },
  {
    key: 'brokers.quotes',
    aggregator: function(quote, oldStructure){
      oldStructure.ids[quote.id].quotes.eq(quote);
      return oldStructure;
    }
  },
  {
    key: 'auctions',
    aggregator: function(newValue, oldStructure){
      oldStructure.auctions.eq(newValue);
      oldStructure.num ++;
      oldStructure.lastAuction = newValue;
      return oldStructure;
    },
    init: {
      auctions: new CircularBuffer(100),
      num: 0,
      lastAuction: {},
      gridSalesDelta: 0,
      gridSales: 0
    }
  },
  {
    key: 'auctions.update',
    aggregator: function(newValue, oldStructure){
      for(var key in newValue){
        oldStructure.lastAuction[key] = newValue[key];
      };
      return oldStructure;
    }
  },
  {
    key: 'auctions.sales',
    aggregator: function(newValue, oldStructure){
      var oldGridSales = parseInt(oldStructure.gridSales);
      newValue.receipts.receipts.forEach(function(receipt){
        if(receipt.seller === 'grid'){
          oldStructure.gridSales += receipt.energy * receipt.price * (receipt.block.blockDuration / 1000 / 60 / 60) ;
        }
      });
      oldStructure.gridSalesDelta = oldStructure.gridSales - oldGridSales;
      return oldStructure;
    }
  }
];

module.exports = aggregations;
