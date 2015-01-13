angular.module('app')
  .controller('NetworkController', function($scope, AggregationService){
    $scope.data = AggregationService.d3nodes;

    AggregationService.addUpdate(function(){
      $scope.$apply.bind($scope)
    });
  })
