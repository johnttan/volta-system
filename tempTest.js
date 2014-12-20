var ioClient = require('socket.io-client')('http://localhost:8000/consumers');
var producerClient = require('socket.io-client')('http://localhost:8000/producers');

ioClient.on('startBidding', function(timeBlock){
  ioClient.emit('bid', {
    data: [
      {
        price: 10
        energy: 10
      }
    ],
    consumerId: ioClient.io.engine.id,
    blockStart: timeBlock.blockStart
  })
  ioClient.on('receipt', function(receipt){
    console.log(receipt)
  })
});

producerClient.on('connect', function(){
  setInterval(function(){
    producerClient.emit('reportSupply', {
      producerId: producerClient.io.engine.id,
      pricePerMWH: 1,
      maxCapacity: 50,
      minCapacity: 0.5
    })
  }, 1000)
})

