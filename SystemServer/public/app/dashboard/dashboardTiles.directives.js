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
          icon: 'icon-group'
        };

        $scope.value = function(){
          if($scope.stats){
            return $scope.stats.num;
          }
        };
      },
      templateUrl: 'quickButton.html',
      replace: true
    }
  })
  .directive('vtProductionTile', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'green',
          title: 'Production',
          icon: 'icon-barcode'
        };

        $scope.value = function(){
          if($scope.stats){
            return $scope.stats.num;
          }
        }
      },
      templateUrl: 'quickButton.html',
      replace: true
    }
  })
  .directive('vtMarketTile', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'blue',
          title: 'Market',
          icon: 'icon-shopping-cart'
        };

        $scope.value = function(){
          if($scope.stats){
            return $scope.stats.num;
          }
        }
      },
      templateUrl: 'quickButton.html',
      replace: true
    }
  })
  .directive('vtTransactionsTile', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'pink',
          title: 'Transactions',
          icon: 'icon-envelope'
        };

        $scope.value = function(){
          if($scope.stats){
            return $scope.stats.num;
          }
        }
      },
      templateUrl: 'quickButton.html',
      replace: true
    }
  })
  .directive('vtControlsTile', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'black',
          title: 'Controls',
          icon: 'icon-calendar'
        }
      },
      templateUrl: 'quickButton.html',
      replace: true
    }
  })
  .directive('vtNetworkTile', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'red',
          title: 'Network',
          icon: 'icon-comments-alt'
        }
      },
      templateUrl: 'quickButton.html',
      replace: true
    }
  })
