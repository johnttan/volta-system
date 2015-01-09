angular.module('app')
  .directive('vtDistributionTile', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'red',
          title: 'Distribution',
          value: 100,
          icon: 'icon-group'
        }
      },
      templateUrl: 'quickButton.html'
    }
  })
