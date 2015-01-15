angular.module('app')
  .controller('TransactionsController', function($scope, TransactionsService){
    $scope.transactions = TransactionsService;
  });
