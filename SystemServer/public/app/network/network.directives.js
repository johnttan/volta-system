angular.module('app')
  .directive('vtNetworkGraph', function(){
    return {
      restrict: 'E',
      scope: {
        data: "="
      },
      controller: function($scope){
      },
      templateUrl: 'networkGraph.html',
      replace: true
    }
  })
