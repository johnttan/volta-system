angular.module('app')
  .factory('AggregationService', function(){
    var aggSocket = io('/aggregation');
    aggSocket.on('aggregations', function(data){
      console.log(data);
    });
    return {};
  })
