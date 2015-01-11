angular.module('app')
  .factory('AggregationService', function(){
    var aggSocket = io('/aggregation');
    var aggregations = {};
    var result = {
      aggregations: aggregations,
      update: [],
      addUpdate: function(updater){
        result.update.push(updater);
      }
    };
    aggSocket.on('aggregations', function(data){
      for(var key in data){
        aggregations[key] = data[key]
      };
      console.log(aggregations)
      result.update.forEach(function(updater){
        if(updater){
          updater();
        }
      })
    });
    return result;
  })