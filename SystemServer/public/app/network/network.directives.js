angular.module('app')
  .directive('vtNetworkGraph', function(){
    return {
      restrict: 'E',
      scope: {
        data: "="
      },
      controller: function($scope){
        var container = document.getElementById('networkGraph');
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
        })
      },
      templateUrl: 'networkGraph.html',
      replace: true
    }
  })
