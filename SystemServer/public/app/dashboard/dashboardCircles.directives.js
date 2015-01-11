angular.module('app')
  .directive('vtGridCapacityCircle', function(){
    
    var extractFromSupply = function (supplyObject, property) {
      var total = 0;
      for (var key in supplyObject) {
        if (key !== "time") {
          var len = supplyObject[key].length;
          total = total + supplyObject[key][len-1][property];
        }
      }
      return total;
    };

    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.circle = {
          title: 'Grid Capacity',
          unit: 'MW',
          color: 'red'
        };


        $scope.value = function () {
          if ($scope.stats && $scope.stats.supply) {
            return extractFromSupply($scope.stats.supply, "currCapacity"); 
          } else {
            return 0;
          }
        };

        $scope.max = function () {
          if ($scope.stats && $scope.stats.supply) {
            return extractFromSupply($scope.stats.supply, "maxCapacity");
          } 
        };

        $scope.ratio = function () {
          if ($scope.stats && $scope.stats.supply) {
            var current = extractFromSupply($scope.stats.supply, "currCapacity");
            var max = extractFromSupply($scope.stats.supply, "maxCapacity"); 
            return  Math.round(100 * current / max, 1); 
          } else {
            return 0;
          }
        };
      },
      templateUrl: 'circleStat.html',
      replace: true,
      link: function link( $scope, element, attributes ) {
        var $el = $(element);
        var $input = $el.find("input");

        
        $scope.$watch("stats", function () {
          if ($scope.stats && $scope.stats.supply) {
            var current = extractFromSupply($scope.stats.supply, "currCapacity");
            var max = extractFromSupply($scope.stats.supply, "maxCapacity"); 
            var ratio =  Math.round(100 * current / max, 1);             
            $input.attr("ng-attr-value", ratio);
            $input.attr("value", ratio);
            $input.trigger("changes", ratio);           
          }
       });
       
      }
    }
  })
  .directive('vtTransientCapacityCircle', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.circle = {
          title: 'Transient Capacity',
          value: 150440,
          max: 98000,
          unit: 'MW',
          color: 'green'
        }
      },
      templateUrl: 'circleStat.html',
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
        $scope.circle = {
          title: 'Sales Target',
          value: 76440,
          max: 98000,
          unit: 'MW',
          color: 'blue'
        }
      },
      templateUrl: 'circleStat.html',
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
        $scope.circle = {
          title: 'Efficiency Target',
          value: 76440,
          max: 98000,
          unit: 'MW',
          color: 'yellow'
        }
      },
      templateUrl: 'circleStat.html',
      replace: true
    }
  })

  