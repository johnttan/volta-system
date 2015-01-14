angular.module('app')
  .controller('DashboardController', function($scope, $state, AggregationService, TransactionsService){
    AggregationService.addUpdate($scope.$apply.bind($scope));
    $scope.aggregations = AggregationService.aggregations;
    $scope.transactions = TransactionsService;
    $scope.isState = function(state){
      console.log(state, $state.is(state))
      return $state.is(state);
    };
    $scope.setState = function(state){
      $state.go(state);
    };
    function getData(){
      var controls = {};
      if($scope.aggregations.producers){
        var controls = $scope.aggregations.producers.controls;
      };
      var num = 100;
      var results = [];
      for(var i = 0; i<num;i++){
        var total = 0;
        for(var key in controls){
          total += controls[key].array[i].productionGoal;
        };
        results.push([i+1, total]);
      };
      return results;
    };

    var options = {
      series: { shadowSize: 1 },
      lines: { show: true, lineWidth: 2, fill: true, fillColor: { colors: [ { opacity: 0.9 }, { opacity: 0.9 } ] }},
      yaxis: { min: 0, max: 100, tickFormatter: function (v) { return v + "%"; }, color: "rgba(255,255,255,0.8)"},
      xaxis: { show: false, color: "rgba(255,255,255,0.8)" },
      colors: ["rgba(255,255,255,0.95)"],
      grid: { tickColor: "rgba(255,255,255,0.15)",
          borderWidth: 0,
      },
    };
    var plot = $.plot($("#serverLoad2"), [ getData() ], options);
    function update() {
      plot.setData([ getData() ]);
      plot.draw();
    };
    AggregationService.addUpdate(update);

    update();
  });
