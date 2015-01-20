angular.module('app')
  .controller('NetworkController', function($scope, AggregationService){
    $scope.data = AggregationService.d3nodes;
    $scope.changelistener = AggregationService.aggregations;

    AggregationService.addUpdate(function(){
      $scope.$apply.bind($scope)
    });
    console.log("listData", $scope.changelistener);
  })
