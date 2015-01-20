angular.module('app')
  .directive('vtNetworkGraph', function(){
    return {
      restrict: 'E',
      scope: {
        data: "=",
        changelistener: "="
      },
      controller: function($scope){
        var container = document.getElementById('networkGraph');
        var options = {
          width: '1200px',
          height: '400px'
        };
        console.log("netwdat", $scope.data);
        console.log("netwlist", $scope);
        var network = new vis.Network(container, $scope.data, options);

        $scope.$watch('changelistener.producers', function(){
          console.log('updateNetw');
          network.setData($scope.data);
        });

        $scope.$watch(function(){
          if($scope.data.nodes && $scope.data.edges){
            return $scope.data.nodes.length + $scope.data.edges.length;
          }
        }, function(){
          console.log('setting data', $scope.data)
          network.setData($scope.data);
        });
      },
      templateUrl: 'networkGraph.html',
      replace: true
    }
  })
