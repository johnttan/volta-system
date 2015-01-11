angular.module('app')
  .directive('vtGridCapacityCircle', function(){
    
    var extractFromControls = function (controlObject, property) {
      var total = 0;
      for (var key in controlObject) {
        if (key !== "time") {
          var len = controlObject[key].array.length;
          total = total + controlObject[key].array[len-1][property];
        }
      }
      return total;
    };

    var extractFromSupply = function (supplyObject, property) {
      var total = 0;
      for (var key in supplyObject) {
        if (key !== "time") {
          var len = supplyObject[key].array.length;
          total = total + supplyObject[key].array[len-1][property];
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
          if ($scope.stats && $scope.stats.controls) {
            return extractFromControls($scope.stats.controls, "productionGoal"); 
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
          if ($scope.stats && $scope.stats.supply && $scope.stats.controls) {
            var current = extractFromControls($scope.stats.controls, "productionGoal");
            var max = extractFromSupply($scope.stats.supply, "maxCapacity"); 
            return  Math.round(100 * current / max, 1); 
          } else {
            return 0;
          }
        };
      },
      templateUrl: 'circleStat.html',
      replace: true,
      link: function ( $scope, element, attributes ) {
        var $el = $(element);
        var $input = $el.find("input");

        
        $scope.$watch("stats", function () {
          if ($scope.stats && $scope.stats.supply && $scope.stats.controls) {
            var current = extractFromControls($scope.stats.controls, "productionGoal");
            var max = extractFromSupply($scope.stats.supply, "maxCapacity"); 
            var ratio =  Math.round(100 * current / max, 1);             
            $input.trigger("changes", ratio);           
          }
       });
       
      }
    }
  })
  .directive('vtTransientCapacityCircle', function(){
    
    var extractFromTransactions = function (transObject) {
      var len = transObject.array.length;
      if (len > 0) {
        var timeblock = transObject.array[len-1].block.blockStart;
        var total = 0;
        for (var i = 0; i < len; i++) {
          if (transObject.array[len - 1 - i].block.blockStart === timeblock && 
                transObject.array[len - 1 - i].seller === "AEB") {
            total = total + transObject.array[len - 1 - i].energy;
          } else if (transObject.array[len - 1 - i].block.blockStart !== timeblock) {
            console.log("tot", total);
            return total;
          }
        }      
      } else {
        return 5;
      }
      return total;
    }

    return {
      restrict: 'E',
      scope: {
        stats: "=",
        trans: "="
      },
      controller: function($scope){
        $scope.circle = {
          title: 'Transient Capacity',
          unit: 'MW',
          color: 'green'
        };

        $scope.value = function () {
          if ($scope.trans && $scope.trans.array) {
            console.log("s", $scope.trans)
            var result =  extractFromTransactions($scope.trans);
            console.log("res", result);
            return result;
          } else {
            return 0;
          }
        };

        $scope.max = function () {
          return 100;
        };

        $scope.ratio = function () {      
          if ($scope.trans) {
            var value = extractFromTransactions($scope.trans);
            var max = 100;
            return  Math.round(100 * value / max, 1); 
          } else {
            return 0;
          }
        };

      },
      templateUrl: 'circleStat.html',
      replace: true,

      link: function ( $scope, element, attributes ) {
        var $el = $(element);
        var $input = $el.find("input");

        console.log("scopeLink", $scope)
        $scope.$watch("stats", function () {
          if ($scope.trans) {
            var value = extractFromTransactions($scope.trans);
            var max = 100;
            var ratio =  Math.round(100 * value / max, 1);
            console.log("to draw", value, max, ratio);           
    //        $input.trigger("changes", ratio);           
          }
        });     
      }

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

  