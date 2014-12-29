process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var fileLog = require('../utils/fileLog');
global.fileLog = fileLog;
var express = require('express');
var app = express();
// Setup reporter
var reporter = new (require('../utils/adminReporter'))();
global.reporter = reporter;
// Setup middleware
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var market = new (require('./market/market'))(config);
var monitor = new (require('./monitor/monitor'))(config);
var consumerManager = new (require('./consumerManager'))(config.consumer, market, monitor);
var producerManager = new (require('./producerManager'))(config.producer, market, monitor);
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

console.log("Running the server file");
console.log("node_env", process.env.node_env); //to check whether it's been set to production when deployed

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
