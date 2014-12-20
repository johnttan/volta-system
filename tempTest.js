var Market = require('./market');
var config = require('./config');
var test = new Market(config['development']);



test.reportSupply({
  producerId: 100,
  data: {
    pricePerMW: 1,
    maxCapacity: 1,
    minCapacity: 0.5
  }
});

test.on('test', function(data){
  console.log(data)
});

test.trigger('test', 'received')


test.on('startBidding', function(){
  for(var i=0;i<10;i++){
    test.bid({
      consumerId: 10 * i,
      data: [
        {
          price: 10 * i,
          energy: 12 * i
        },
        {
          price: 12 * i/2,
          energy: 10 * i/2
        }
      ]
    });
  }
});

test.startMarket();
