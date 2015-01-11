angular.module('app')
  .directive('vtPriceBox', function(){
    return {
      restrict: 'E',
      scope: {
        stats: "="
      },
      controller: function($scope){
        var data = new CircularBuffer(14);
        $scope.tile = {
          color: 'purple',
          icon: 'icon-arrow-up',
          title: 'Price',
          class: 'price'
        };

        $scope.data = function(){
          if($scope.stats){
            var auctionsList = $scope.stats.auctions.array;
            var max = 0;
            for(var i = 1; i < 15; i++){
              var auction = auctionsList[auctionsList.length - i];
              if(auction && auction.receipts.receipts[0]){
                var price = auction.receipts.receipts[0].price;
                if(price > max){
                  max = price;
                };
                data.eq(price);
              }
            };
            var result = [];
            data.array.forEach(function(el){
              if(el){
                result.push((el / max) * 10);
              }
            });
            result[0] = 0;
            $('.boxchart.' + $scope.tile.class).sparkline(result, {
              type: 'bar',
              height: '60',
              barWidth: '4',
              barSpacing: '1',
              barColor: '#ffffff',
              negBarColor: '#eeeeee'
            });
          }
        };

        $scope.number = function(){
          if(data.array && data.array.length >= 1){
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
        var data = new CircularBuffer(14);
        $scope.tile = {
          color: 'green',
          number: '123,000',
          icon: 'icon-arrow-up',
          title: 'Consumer Demand',
          class: 'consumerDemand'
        };

        $scope.data = function(){
          if($scope.stats){
            var auctionsList = $scope.stats.auctions.array;
            var max = 0;
            for(var i = 1; i < 15; i++){
              var auction = auctionsList[auctionsList.length - i];
              if(auction && auction.bids[0]){
                var sum = 0;
                auction.bids.forEach(function(bid){
                  sum += bid.energy;
                });
                if(sum > max){
                  max = sum;
                };
                data.eq(sum);
              }
            };
            var result = [];
            data.array.forEach(function(el){
              if(el){
                result.push(Math.floor((el / max) * 10));
              }
            });
            result[0] = 0;
            $('.boxchart.' + $scope.tile.class).sparkline(result, {
              type: 'bar',
              height: '60',
              barWidth: '4',
              barSpacing: '1',
              barColor: '#ffffff',
              negBarColor: '#eeeeee'
            });
          };
        };

        $scope.number = function(){
          if(data.array && data.array.length >= 1){
            return Math.floor(data.array[data.array.length-1]).toString() + ' MW';
          }
        };
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
        };

        $scope.data = function(){
          return [5,6,7,2,0,-4,-2,4,8,2,3,3,2].join(',');
        };
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
        };

        $scope.data = function(){
          return [5,6,7,2,0,-4,-2,4,8,2,3,3,2].join(',');
        };
      },
      templateUrl: 'statBox.html',
      replace: true
    }
  })
