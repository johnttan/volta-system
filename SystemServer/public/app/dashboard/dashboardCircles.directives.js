angular.module('app')
  .directive('vtGridCapacityCircle', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          title: 'Grid Capacity',
          value: 90,
          max: 100,
          unit: 'MW',
          color: 'red'
        }
      },
      templateUrl: 'circleTile.html',
      replace: true
    }
  })
  .directive('vtTransientCapacityCircle', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          title: 'Transient Capacity',
          value: 76440,
          max: 98000,
          unit: 'MW',
          color: 'green'
        }
      },
      templateUrl: 'circleTile.html',
      replace: true
    }
  })
  .directive('vtSalesTargetCircle', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          title: 'Sales Target',
          value: 76440,
          max: 98000,
          unit: 'MW',
          color: 'blue'
        }
      },
      templateUrl: 'circleTile.html',
      replace: true
    }
  })
  .directive('vtEfficiencyTargetCircle', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          title: 'Efficiency Target',
          value: 76440,
          max: 98000,
          unit: 'MW',
          color: 'yellow'
        }
      },
      templateUrl: 'circleTile.html',
      replace: true
    }
  })

  