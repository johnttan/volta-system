angular.module('app')
  .factory('AggregationService', function(){
    var aggSocket = io('/aggregation');
    var aggregations = {};
    var result = {
      aggregations: aggregations,
      update: function(){},
      addUpdate: function(update){
        result.update = update;
      }
    };
    aggSocket.on('aggregations', function(data){
      for(var key in data){
        aggregations[key] = data[key]
      };
      console.log(Object.keys(aggregations));
      result.update();
    });
    return result;
  })
