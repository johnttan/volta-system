angular.module('app')
  .controller('NetworkController', function($scope, AggregationService){
    $scope.data = AggregationService.d3nodes;

    AggregationService.addUpdate(function(){
      console.log('updating', $scope.data)
      $scope.$apply.bind($scope)
    });
  })
