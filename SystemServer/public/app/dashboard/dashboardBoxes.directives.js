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
          title: 'Price',
          class: 'price'
        };
        $scope.icon = function(){
          if(data.array && data.array.length >= 2 && data.array[data.array.length-1] >= data.array[data.array.length-2]){
            return 'icon-arrow-up';
          }else{
            return 'icon-arrow-down';
          }
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
            if(max === 0){
              max = 1;
            };
            var result = [];
            data.array.forEach(function(el){
              if(el){
                result.push((el / max) * 100);
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
          if(data.array && data.array.length >= 1 && data.array[data.array.length-1]){
            return '$' + data.array[data.array.length-1].toFixed(2).toString();
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
          title: 'Consumer Demand',
          class: 'consumerDemand'
        };
        $scope.icon = function(){
          if(data.array && data.array.length >= 3 && data.array[data.array.length-2] >= data.array[data.array.length-3]){
            return 'icon-arrow-up';
          }else{
            return 'icon-arrow-down';
          }
        };
        $scope.data = function(){
          if($scope.stats){
            var auctionsList = $scope.stats.auctions.array;
            var max = 0;
            for(var i = 14; i > 0; i--){
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
            if(max === 0){
              max = 1;
            };
            data.array.forEach(function(el){
              if(el){
                result.push(Math.floor((el / max) * 100));
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
          if(data.array && data.array.length >= 2){
            for(var i=data.array.length-2;i>=0;i--){
              if(data.array[i] > 0){
                return data.array[i].toFixed().toString() + ' MW';
              }
            }
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
        var data = new CircularBuffer(14);
        $scope.tile = {
          color: 'blue',
          title: 'Grid Sales Delta',
          class: 'gridSalesDelta'
        };
        $scope.icon = function(){
          if(data.array && data.array.length >= 2 && data.array[data.array.length-1] >= data.array[data.array.length-2]){
            return 'icon-arrow-up';
          }else{
            return 'icon-arrow-down';
          }
        };
        $scope.data = function(){
          if($scope.stats){
            var auctionsList = $scope.stats.auctions.array;
            var max = 0;
            data.eq($scope.stats.gridSalesDelta);
            var result = [];
            var max = Math.max.apply(null, data.array);
            if(!max){
              max = 1;
            };
            data.array.forEach(function(el){
              if(el){
                result.push(Math.floor((el / max) * 1000));
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
          if($scope.stats){
            return '$' + $scope.stats.gridSalesDelta.toFixed(2).toString();
          }
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
          icon: 'icon-arrow-up',
          title: 'Alternative Sales Delta',
          class: 'alternativeSales'
        };

        $scope.icon = function(){
          if($scope.stats && $scope.stats.deltaHistory.length > 2 && $scope.stats.deltaHistory[$scope.stats.deltaHistory.length-1] > $scope.stats.deltaHistory[$scope.stats.deltaHistory.length-2]){
            return 'icon-arrow-up';
          }else{
            return 'icon-arrow-down'
          }
        };
        $scope.data = function(){
          if($scope.stats){
            var data = $scope.stats.deltaHistory;
            var result = [];
            var max = Math.max.apply(null, data);
            if(!max){
              max = 1;
            };
            data.forEach(function(el){
              if(el){
                result.push(Math.floor((el / max) * 1000));
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
          if($scope.stats && $scope.stats.deltaHistory && ($scope.stats.deltaHistory.length > 0)){
            return '$' + $scope.stats.deltaHistory[$scope.stats.deltaHistory.length-1].toFixed(2).toString();
          }
        };

      },
      templateUrl: 'statBox.html',
      replace: true
    }
  })
