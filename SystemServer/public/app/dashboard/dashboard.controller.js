angular.module('app')
  .controller('DashboardController', function($scope, AggregationService){
    AggregationService.addUpdate($scope.$apply.bind($scope));
    $scope.aggregations = AggregationService.aggregations;
    $scope.circleStats = [
      {
        title: 'Grid Capacity',
        value: 90,
        max: 100,
        unit: 'MW',
        color: 'red'
      },
      {
        title: 'Transient Capacity',
        value: 76440,
        max: 98000,
        unit: 'MW',
        color: 'green'
      },
      {
        title: 'Sales Target',
        value: 76440,
        max: 98000,
        unit: 'MW',
        color: 'blue'
      },
      {
        title: 'Efficiency Target',
        value: 76440,
        max: 98000,
        unit: 'MW',
        color: 'yellow'
      }
    ];
    $scope.statBoxes = [
      {

      }
    ];
  });
