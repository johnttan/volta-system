angular.module('app')
  .controller('ProducersController', function($scope, AggregationService){
    $scope.data = AggregationService.aggregations;

    AggregationService.addUpdate(function(){
      $scope.$apply.bind($scope)
    });
    console.log("prodData", $scope.data);
  })