angular.module('app')
  .directive('vtGridCapacityCircle', function(){
    
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

       $scope.newProp = 3;

       $scope.value = function () {
         if ($scope.stats && $scope.stats.supply) {
           $scope.newProp = ($scope.newProp+1) % 5;
           console.log("called");
           return extractFromSupply($scope.stats.supply, "currCapacity"); 
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
           return  100 * current / max; 
         }
       };

       $scope.test = function () {
         return 3;
       };






       // $scope.$apply(function () {
        /* var $el = $(element);
         var $input = $el.find("input");
         console.log("el", $el.find("input"));*/
        // console.log("attr", attributes);
         /*if ($scope.stats && $scope.stats.supply) {
           var current = extractFromSupply($scope.stats.supply, "currCapacity");
           var max = extractFromSupply($scope.stats.supply, "maxCapacity"); 
           var ratio =  100 * current / max; 
           console.log("here", ratio);
           $input.attr("ng-attr-value", ratio);
           $input.attr("value", ratio);
          }*/
       //  });

    //   var value = 7;

       /*setInterval(function() {
        value = value + 1;
        console.log("val", value);
        $scope.$apply(function () {
          $scope.newProp = value;
        });
       }, 1000);*/

       

      },
      templateUrl: 'circleStat.html',
      replace: true,
      link: function link( $scope, element, attributes ) {
        var value = 7;
        var $el = $(element);
        var $input = $el.find("input");
        //var $input = $el.find("canvas");
        console.log("el", $el);
        console.log("attr", attributes);
        //console.log("canv", canvas);
        console.log("scope", $scope);

        /*$input.change(function() { //THIS LISTENS FOR A CHANGE IN THE input TEXT BOX
                console.log("changed");
              var t = $('input').val();
              $("input").val(t).trigger('change');
          });*/

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

        /*setInterval(function() {
          $scope.newProp++
        }, 1000);*/
        
       $scope.$watch("stats", function () {
         if ($scope.stats && $scope.stats.supply) {
          console.log("there");
           var current = extractFromSupply($scope.stats.supply, "currCapacity");
           var max = extractFromSupply($scope.stats.supply, "maxCapacity"); 
           var ratio =  Math.round(100 * current / max, 1); 
           console.log("here", ratio);
           $input.attr("ng-attr-value", ratio);
           $input.attr("value", ratio);
           $input.trigger("changes", ratio);
           /*$input.knob({
          'min':0,
          'max':100,
          'readOnly': false,
          'width': 240,
          'height': 240,
      'bgColor': 'rgba(255,255,255,0.5)',
          'fgColor': 'rgba(255,255,255,0.9)',
          'dynamicDraw': true,
          'thickness': 0.2,
          'tickColorizeValues': true
      });
*/
           // circle_progess();
           /*var ctx = document.getElementById('canvas');
           console.log("canv", ctx);

  // ctx.globalCompositeOperation = 'destination-over';
          ctx.clearRect(); // clear canvas*/
          }
         });
       
       }

     //     console.log("value", value);
      
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

  