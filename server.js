var config = require('./config')[process.argv[2]];
var express = require('express');
var app = express();
// Setup reporter
var reporter = new (require('./adminReporter'))();
global.reporter = reporter;
// Setup middleware
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var market = new (require('./market'))(config);
var consumerManager = new (require('./consumerManager'))(config.consumer, market);
var producerManager = new (require('./producerManager'))(config.producer, market);

// Setup server.
server.listen(config.port);

// Serve admin
app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html')
});

// Serve stats
app.get('/api/stats', function(req, res){
  res.json(reporter.update())
});

// Setup listeners for connections on namespaces
var consumerNsp = io.of('/consumers');
consumerNsp.on('connection', function(socket){
  consumerManager.addConsumer(socket);
});

var producerNsp = io.of('/producers');
producerNsp.on('connection', function(socket){
  producerManager.addProducer(socket);
});

/*
Setup market listeners
timeBlock is of the form
{
  blockStart: 123123124,
  biddingDuration: 10
  blockDuration: 120,
  minPrice: .2,
  maxPrice: 20
}
*/

market.on('startBidding', function(timeBlock){
  consumerNsp.emit('startBidding', timeBlock);
  producerNsp.emit('requestSupply', timeBlock);
});

market.on('changeProduction', function(controls){

});

market.startMarket();
