angular.module('app')
  .controller('DashboardController', function($scope, AggregationService){
    AggregationService.addUpdate($scope.$apply.bind($scope));
    $scope.aggregations = AggregationService.aggregations;
    $scope.tiles = [
      {
        color: 'red',
        title: 'Distribution',
        value: 100,
        icon: 'icon-group'
      },
      {
        color: 'green',
        title: 'Production',
        value: 200,
        icon: 'icon-barcode'
      },
      {
        color: 'blue',
        title: 'Market',
        value: 13,
        icon: 'icon-shopping-cart'
      },
      {
        color: 'pink',
        title: 'Transactions',
        value: 88,
        icon: 'icon-envelope'
      },
      {
        color: 'black',
        title: 'Controls',
        icon: 'icon-calendar'
      },
      {
        color: 'red',
        title: 'Network',
        icon: 'icon-comments-alt'
      }
    ]
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
