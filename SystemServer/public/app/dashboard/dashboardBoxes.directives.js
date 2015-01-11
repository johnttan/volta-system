angular.module('app')
  .directive('vtPriceBox', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        var data = new CircularBuffer(13);
        $scope.tile = {
          color: 'purple',
          icon: 'icon-arrow-up',
          title: 'Price'
        };

        $scope.data = function(){
          if($scope.stats){
            var auctionsList = $scope.stats.auctions.array;
            for(var i = 1; i < 14; i++){
              var auction = auctionsList[auctionsList.length - i];
              if(auction && auction.receipts.receipts[0]){
                data.eq(auction.receipts.receipts[0].price)
              }
            };
            return data.array.join(',');
          }
        };

        $scope.number = function(){
          if(data.array){
            return '$' + data.array[data.array.length-1].toString();
          }
        };

      },
      templateUrl: 'statBox.html',
      replace: true
    }
  })
  .directive('vtConsumerDemandBox', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'green',
          data: [5,6,7,2,0,-4,-2,4,8,2,3,3,2],
          number: '123,000',
          icon: 'icon-arrow-up',
          title: 'Consumer Demand'
        }
      },
      templateUrl: 'statBox.html',
      replace: true
    }
  })
  .directive('vtGridSalesBox', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'blue',
          data: [5,6,7,2,0,-4,-2,4,8,2,3,3,2],
          number: '$900,900',
          icon: 'icon-arrow-up',
          title: 'Grid Sales'
        }
      },
      templateUrl: 'statBox.html',
      replace: true
    }
  })
  .directive('vtAlternativeSalesBox', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        $scope.tile = {
          color: 'yellow',
          data: [7,2,2,2,1,-4,-2,4,8,,0,3,3,5],
          number: '$100,099',
          icon: 'icon-arrow-down',
          title: 'Alternative Sales'
        }
      },
      templateUrl: 'statBox.html',
      replace: true
    }
  })
