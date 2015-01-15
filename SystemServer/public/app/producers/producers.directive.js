angular.module('app')
  .directive('vtProducersGraph', function(){

    var extractFromControlsSupplyEach = function (controlObject, supplyObject) {
      var productionGoals = [];
      var capacities = [];
      var ticks = [];
      var len;
      var name;
      var productionLevel;
      var capacityLevel;
      var i = 0;
      var max = 0;
      for (var key in controlObject) {
        i++;
        name = 'Producer '+ i;
        len = controlObject[key].array.length;
        if (len > 0) {
          productionLevel = controlObject[key].array[len-1].productionGoal;
          capacityLevel = supplyObject[key].array[len-1].maxCapacity;
          productionGoals.push([productionLevel, i]);
          if (capacityLevel > max) {
            max = capacityLevel;
          }
          capacities.push([capacityLevel - productionLevel, i]);
          ticks.push([i, name]);
        }  
      }
      return [productionGoals, capacities, ticks, max, i];
    };

    return {
      restrict: 'E',
      scope: {
        data: "="
      },
      controller: function($scope){
        var container = $('#producersGraph');

        var barnumberFormatter = function(value) {
          if (value>0) {
            return Math.round(value, 0);
            
          }
        }
      
        var options = {
          series: {
            stack: true,
            bars: {
              show: true,
              horizontal: true,
              fill: 1,
              align: "center"
             
            }
          },
        bars: {
            lineWidth: 1,
            barWidth: 0.5,
            horizontal: true,
  
    
            numbers: {
                show: true,
                fontColor: "#FFFFFF",
                formatter: barnumberFormatter,
                yAlign: function(y) {
                  return y; }
              }
        },
        
        xaxis: {
            color: "black",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 14,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
        },
        yaxis: {
            tickLength: 0,        
            color: "black",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 14,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 4
           },
           legend: {
             show: true,
             position: "ne"
          },
         grid: {
            borderColor: {
              top: "#FFFFFF",
              right: "#FFFFFF"
            }
          }
        };

        
        $scope.$watch('data.producers', function(){
          var dataForChart = extractFromControlsSupplyEach($scope.data.producers.controls, $scope.data.producers.supply);
          console.log('setting data', dataForChart);
          var dataset = [{label: "Production", data: dataForChart[0], color: "#00A300"}, {label: "Spare capacity", data: dataForChart[1], color: "#AAE0AA"}];
          options.yaxis.ticks = dataForChart[2];
          options.xaxis.max = dataForChart[3] * 1.1;
          options.yaxis.max = dataForChart[4] + 1;
          $.plot(container, dataset, options);
        })


      },
      templateUrl: 'producersGraph.html',
      replace: true
    }
  })