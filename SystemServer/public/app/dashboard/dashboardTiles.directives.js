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
          value: 100,
          icon: 'icon-barcode'
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
          value: 13,
          icon: 'icon-shopping-cart'
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
          value: 88,
          icon: 'icon-envelope'
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
