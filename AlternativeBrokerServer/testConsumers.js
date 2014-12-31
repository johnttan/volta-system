var numConsumers = 2;
var clients = [];
for(var i=0;i<numConsumers;i++){
  var id = Math.random().toString().substr(2);
  var client = require('socket.io-client')('http://localhost:8011/market');
  (function(id){
    client.on('startCollection', function(timeBlock){
      if(Math.random() > .5){
        client.emit('demand', {
          timeBlock: timeBlock,
          energy: Math.random() * 10,
          consumerId: id
        })
      }else{
        client.emit('supply', {
          timeBlock: timeBlock,
          energy: Math.random() * 10,
          producerId: id
        })
      }
    })
    clients.push({socket:client, id: id});
  })(id)
};
