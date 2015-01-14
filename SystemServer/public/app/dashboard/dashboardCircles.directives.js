angular.module('app')
  .directive('vtGridCapacityCircle', function(){
    
    var extractFromControls = function (controlObject, property) {
      var total = 0;
      for (var key in controlObject) {
        if (key !== "time") {
          var len = controlObject[key].array.length;
          if (len > 0) {
            total = total + controlObject[key].array[len-1][property];  
          }
        }
      }
      return total;
    };

    var extractFromSupply = function (supplyObject, property) {
      var total = 0;
      for (var key in supplyObject) {
        if (key !== "time") {
          var len = supplyObject[key].array.length;
          if (len > 0) {
            total = total + supplyObject[key].array[len-1][property]; 
          }
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
          title: 'Grid Capacity Usage',
          unit: 'MW',
          color: 'red',
          class: 'gridcapacity'
        };
        
        $scope.newProp = 9;

        $scope.value = function () {
          if ($scope.stats && $scope.stats.controls) {
            $scope.val = extractFromControls($scope.stats.controls, "productionGoal"); 
          } else {
            $scope.val = 0;
          }
          return $scope.val;
        };

        $scope.max = function () {
          if ($scope.stats && $scope.stats.supply) {
            $scope.maxvalue = extractFromSupply($scope.stats.supply, "maxCapacity");
            return $scope.maxvalue;
          } 
        };

        $scope.ratio = function () {
          if (($scope.val || $scope.val === 0) && $scope.maxvalue) {
            $scope.rat = Math.round(100 * $scope.val/$scope.maxvalue, 0);
            $('.whiteCircle.' + $scope.circle.class).trigger("changes", $scope.rat);
            return $scope.rat;
          } else {
            return 0;
          }
        };
      },
      templateUrl: 'circleStat.html',
      replace: true
    }
  })
  .directive('vtTransientCapacityCircle', function(){
    
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

    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.circle = {
          title: 'Solar as Share of Total Energy',
          unit: 'MW',
          color: 'green',
          class: 'solarcapacity'
        };

        $scope.value = function () {
          if ($scope.stats && $scope.stats.brokers && $scope.stats.brokers.auctions) {
            $scope.val = $scope.stats.brokers.auctions.totalSupply;
          } else {
            $scope.val = 0;
          }
          return $scope.val;
        };

        $scope.max = function () {
          var solar;
          var traditional;
          if ($scope.stats && $scope.stats.brokers && $scope.stats.brokers.auctions) {
            solar = $scope.stats.brokers.auctions.totalSupply;
          }
          if ($scope.stats && $scope.stats.producers && $scope.stats.producers.controls) {
            traditional = extractFromControls($scope.stats.producers.controls, "productionGoal"); 
          } 
          if (solar + traditional > 0) {
            $scope.maxvalue = solar + traditional;
            return $scope.maxvalue;
          } else {
            console.log("Error: zero total production");
          }
        };

        $scope.ratio = function () {
          if (($scope.val || $scope.val === 0) && $scope.maxvalue) {
            $scope.rat = Math.round(100 * $scope.val/$scope.maxvalue, 0);
            $('.whiteCircle.' + $scope.circle.class).trigger("changes", $scope.rat);
            return $scope.rat;
          } else {
            return 0;
          }
        };


      },
      templateUrl: 'circleStat.html',
      replace: true
      
    }
  })
  .directive('vtProfitSalesCircle', function(){

    var extractRegularFromTransactions = function (transArray) {
      var len = transArray.length;
      if (len>0) {
        for (var i = 0; i < len; i++) {
          if(transArray[len-1-i].seller === "grid") {
            return transArray[len-1-i].price;
          }
        }
      } else {
        return 0;
      }
    };

    return {
      restrict: 'E',
      scope: {
        stats: "=",
        price: "="
      },
      controller: function($scope){
        $scope.circle = {
          title: 'Profitability',
          unit: 'USD',
          color: 'blue',
          class: 'profitability'
        };
        

        $scope.value = function () {
          var price = 0;
          if ($scope.price && $scope.price.transactions && $scope.price.transactions.array) {
            price = extractRegularFromTransactions($scope.price.transactions.array);
          } 
          var profitTotal = 0;
          var duration = 0;
          var profit;
          var production;
          var costs;
          if ($scope.stats && $scope.stats.producers && $scope.stats.producers.controls) {
            var controlObject = $scope.stats.producers.controls;
            var supplyObject = $scope.stats.producers.supply;
            for (var key in controlObject) {
              if (key !== "time") {
                var len = controlObject[key].array.length;
                if (len > 0) {
                  production = controlObject[key].array[len-1].productionGoal;  
                  duration = controlObject[key].array[len-1].timeBlock.blockDuration;
                  costs = supplyObject[key].array[len-1].pricePerMWH;
                  profit = (price - costs) * production * duration;
                  profitTotal = profitTotal + profit;
                }
              }
            }
          }
          $scope.val = profitTotal / 1000;
          return $scope.val;
        };

        $scope.max = function () {
          var price = 0;
          if ($scope.price && $scope.price.transactions && $scope.price.transactions.array) {
            price = extractRegularFromTransactions($scope.price.transactions.array);
          } 
          var total = 0;
          var duration = 0;
          if ($scope.stats && $scope.stats.producers && $scope.stats.producers.controls) {
            var controlObject = $scope.stats.producers.controls;
            for (var key in controlObject) {
              if (key !== "time") {
                var len = controlObject[key].array.length;
                if (len > 0) {
                  total = total + controlObject[key].array[len-1].productionGoal;  
                  duration = controlObject[key].array[len-1].timeBlock.blockDuration;
                }
              }
            }
          }

          $scope.maxvalue = price * total * duration / 1000;
          return $scope.maxvalue;
        };
        

        $scope.ratio = function () {
          if (($scope.val || $scope.val === 0) && $scope.maxvalue) {
            $scope.rat = Math.round(100 * $scope.val/$scope.maxvalue, 0); 
            $('.whiteCircle.' + $scope.circle.class).trigger("changes", $scope.rat);
            return $scope.rat;
          } else {
            return 0;
          }
        };


      },
      templateUrl: 'circleStat.html',
      replace: true
    }
  })
  .directive('vtSolarPriceDiscountCircle', function(){
    
    var extractSolarFromTransactions = function (transArray) {
      var len = transArray.length;
      if (len>0) {
        for (var i = 0; i < len; i++) {
          if(transArray[len-1-i].seller === "AEB") {
            return transArray[len-1-i].price;
          }
        }
      } else {
        return 0;
      }
    };

    var extractRegularFromTransactions = function (transArray) {
      var len = transArray.length;
      if (len>0) {
        for (var i = 0; i < len; i++) {
          if(transArray[len-1-i].seller === "grid") {
            return transArray[len-1-i].price;
          }
        }
      } else {
        return 0;
      }
    };

    return {
      restrict: 'E',
      scope: {
        stats: "=",
        changelisten: "="
      },
      controller: function($scope){
        $scope.circle = {
          title: 'Solar Price Discount',
          unit: 'USD',
          color: 'yellow',
          class: 'pricediscount'
        };
        
        $scope.value = function () {
          if ($scope.stats && $scope.stats.transactions && $scope.stats.transactions.array) {
            $scope.val = extractSolarFromTransactions($scope.stats.transactions.array);
            return $scope.val;
          } else {
            return 0;
          }
        };

        $scope.max = function () {
          if ($scope.stats && $scope.stats.transactions && $scope.stats.transactions.array) {
            $scope.maxvalue = extractRegularFromTransactions($scope.stats.transactions.array);
            return $scope.maxvalue
          } else {
            return 0;
          }
        };

        $scope.ratio = function () {
          if (($scope.val || $scope.val === 0) && $scope.maxvalue) {
            $scope.rat = Math.round(100 * $scope.val/$scope.maxvalue, 0);
            $('.whiteCircle.' + $scope.circle.class).trigger("changes", $scope.rat);
            return $scope.rat;
          } else {
            return 0;
          }
        };

      },
      templateUrl: 'circleStat.html',
      replace: true
    }
  })

  