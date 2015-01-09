angular.module('app')
  .controller('DashboardController', function($scope, AggregationService){
    AggregationService.addUpdate($scope.$apply.bind($scope));
    $scope.aggregations = AggregationService.aggregations;
    
  });
