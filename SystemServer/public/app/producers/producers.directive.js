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
      for (var key in controlObject) {
        i++;
        name = 'Producer '+ i;
        len = controlObject[key].array.length;
        if (len > 0) {
          productionLevel = controlObject[key].array[len-1].productionGoal;
          capacityLevel = supplyObject[key].array[len-1].maxCapacity;
          productionGoals.push([productionLevel, i]);
          capacities.push([capacityLevel - productionLevel, i]);
          ticks.push([i, name]);
        }  
      }
      return [productionGoals, capacities, ticks];
    };

    return {
      restrict: 'E',
      scope: {
        data: "="
      },
      controller: function($scope){
        console.log("dcoerid", $scope)
        var container = $('#producersGraph');
        console.log("container", container);

   

       /* var data1 = [[4,1],[5,2],[6,3]];
        var data2 = [[1,1],[1,2],[1,3]];
        var ticks = [
          [1, "Gold"], [2, "Silver"], [3, "Platinum"]
        ];
        var dataset = [{label: "Production", data: data1, color: "#00A300"}, {label: "Spare capacity", data: data2}];*/
        var options2 = {
          series: {
            stack: true,
            bars: {
              show: true,
              horizontal: true,
              barWidth: 0.5
            }
          },
        /*bars: {
            lineWidth: 1,
            barWidth: 24 * 60 * 60 * 450,
            horizontal: true
        },
        xaxis: {
            color: "black",
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10,
            tickFormatter: function (v, axis) {
                return $.formatNumber(v, { format: "#,###", locale: "us" });
            }
        },*/
        yaxis: {
          //ticks: ticks
            /*mode: "time",
            tickSize: [3, "day"],
            min: gd(2012, 1, 1),
            max: gd(2012, 1, 31),
            tickLength: 10,        
            color: "black",
            axisLabel: "DNS Query Count",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3*/
           }
        /*grid: {
            hoverable: true,
            borderWidth: 2,
            backgroundColor: { colors: ["#EDF5FF", "#ffffff"] }
        }*/
        };

        // $.plot(container, dataset, options2); 

        /*$.plot(container, [{ data: [ [4, 1], [2, 14], [3, 4]], bars: {
            show: true,
            horizontal: true
        }, stack: true }])      */  
        /*var container = document.getElementById('networkGraph');
        var options = {
          width: '1800px',
          height: '600px'
        };
        var network = new vis.Network(container, $scope.data, options);
        $scope.$watch(function(){
          if($scope.data.nodes && $scope.data.edges){
            return $scope.data.nodes.length + $scope.data.edges.length;
          }
        }, function(){
          console.log('setting data', $scope.data)
          network.setData($scope.data);
        })*/
        
        $scope.$watch('data.producers'
          /*function(){
            if($scope.data.producers && $scope.data.producers.controls){
              for (key in $scope.data.producers.controls) {
                var len = $scope.data.producers.controls[key].array.length;
                var toWatch = $scope.data.producers.controls[key].array[len - 1].timeBlock.blockStart;
                console.log("watch", toWatch);
                return toWatch;  
              }
            }
          }*/
        , function(){

          var dataForChart = extractFromControlsSupplyEach($scope.data.producers.controls, $scope.data.producers.supply);
          console.log('setting data', dataForChart);
          var dataset = [{label: "Production", data: dataForChart[0], color: "#00A300"}, {label: "Spare capacity", data: dataForChart[1]}];
          options2.yaxis.ticks = dataForChart[2];
          $.plot(container, dataset, options2); 


        })



      },
      templateUrl: 'producersGraph.html',
      replace: true
    }
  })