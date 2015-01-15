angular.module('app')
  .controller('MarketController', function($scope, AggregationService){
    
    $scope.aggregations = AggregationService.aggregations;
    console.log("CONTROLLLLLLLLLLERRRRRRRRRRRRRRRRRRRRRR")
    $scope.tableRows = [];


    $scope.$watch(function(scope){
      return scope.aggregations.auctions}, function(newValue, oldValue) {
      if ($scope.aggregations.auctions) {
        console.log("RRRRRRRRRRRRRRRRRRRRRUUUUUNNNNNN")
        $scope.auctions = $scope.aggregations.auctions.auctions.array;
        // $scope.tableRows = [];

        for (var i = $scope.auctions.length-1; i >= 0; i--){
          console.log("AUCCCTTIONNNNNNNNNNNNNNNNNNNNN")
          var auction = $scope.auctions[i];
          var bidders = auction.bidders;
          var bids = auction.bids;
          var blockStart = auction.currentBlock.blockStart;
          var blockDuration = auction.currentBlock.blockDuration;
          var numOfBidders = Object.keys(bidders).length;
          for (var j = 0; j < numOfBidders; j++){
            console.log("BBBBBBBBBIIIIIDDDEEERRRRSSSSS")
            var tableRowData = {
              numOfBidders: numOfBidders,
              position: j,
              auctionNum: i,
              bidder: Object.keys(bidders)[j],
              energyBid: bids[j].energy,
              priceBid: bids[j].price,
              blockStart: blockStart,
              blockDuration: blockDuration
            }
            if ($scope.tableRows.length < 10) {
              $scope.tableRows.unshift(tableRowData);
            } else {
              $scope.tableRows.pop()
              $scope.tableRows.unshift(tableRowData);
            }
          }
          for (var k = 0; k < $scope.tableRows.length; k++){
            if ($scope.tableRows[k].position === $scope.tableRows[k].numOfBidders-1){
              $scope.tableRows[k].rowspan = $scope.tableRows[k].numOfBidders;
            }
          }
        }
        console.log($scope.tableRows);
      }
    });
  });