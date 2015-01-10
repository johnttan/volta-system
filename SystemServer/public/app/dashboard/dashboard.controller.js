angular.module('app')
  .controller('DashboardController', function($scope, AggregationService, TransactionsService){
    AggregationService.addUpdate($scope.$apply.bind($scope));
    $scope.aggregations = AggregationService.aggregations;

  });
