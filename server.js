var config = require('./config')[process.argv[2]];
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var consumerManager = require('./consumerManager');
var producerManager = require('./producerManager');
var market = require('./market');

// Setup server.
server.listen(config.port);

// Server admin portal
app.get('/admin', function(req, res){
  res.sendfile(__dirname + '/admin.html');
});


// Setup listeners for connections on namespaces
var consumerNsp = io.of('/consumers');
consumerNsp.on('connection', function(socket){
  setupConsumerSocket(socket);
});

var producerNsp = io.of('/producers');
producerNsp.on('connection', function(socket){
  setupProducerSocket(socket);
});

// Setup market listeners
// timeBlock is of the form
// {
//   blockStart: 123123124,
//   duration: 12,
//   minPrice: .2,
//   maxPrice: 20
// }

market.on('startBidding', function(timeBlock){
});

market.on('marketClose', function(receipts){
});

// Functions for setting up listeners on sockets
function setupProducerSocket(socket){
  // data of form
  // {
  //   productionId: 12345,
  //   pricePerMW: 1,
  //   maxCapacity: 1,
  //   minCapacity: 0.5
  // }
  socket.on('reportSupply', function(data){
    market.reportSupply(data)
  })
};

function setupConsumerSocket(socket){
  socket.on('bid', function(bids){
    market.bid(bids);
  });
  socket.on('consume', function(consumption){
    console.log(consumption);
  })
};
