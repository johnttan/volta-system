angular.module('app')
  .controller('DashboardController', function($scope, $state, AggregationService, TransactionsService){
    AggregationService.addUpdate($scope.$apply.bind($scope));
    $scope.aggregations = AggregationService.aggregations;
    $scope.transactions = TransactionsService;
    $scope.isState = function(state){
      return $state.is(state);
    };
    $scope.setState = function(state){
      $state.go(state);
    };
  });
