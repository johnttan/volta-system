process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var DiscoveryClient = require('../utils/discoveryClient');
var fileLog = require('../utils/fileLog');
global.fileLog = fileLog;
var express = require('express');
var app = express();
// Setup reporter
var reporter = new (require('../utils/adminReporter'))();
var Aggregator = require('../utils/aggregator');
global.reporter = reporter;
// Setup middleware
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var market = new (require('./market/market'))(config);
var monitor = new (require('./monitor/monitor'))(config);
var consumerManager = new (require('./consumerManager'))(config.consumer, market, monitor);
var producerManager = new (require('./producerManager'))(config.producer, market, monitor);
var aggregations = require('./aggregations');
// Setup server.
server.listen(config.port);

// Start Aggregation client
var aggregationNsp = io.of('/aggregation');
var aggregator = new Aggregator(aggregationNsp);
aggregator.registerAll(aggregations);

// Serve admin
app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html')
});

// Serve stats
app.get('/api/stats', function(req, res){
  res.json(reporter.update())
});
app.get('/api/controls', function(req, res){
  res.json({});
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

var brokerNsp = io.of('/brokers');
brokerNsp.on('connection', function(socket){
  console.log('broker connected');
  market.on('marketClose', function(auction){
    socket.emit('marketClose', auction.currentBlock);
  });
  socket.on('queryPrice', function(demand){
    try{
      var result = market.computeBasedOnDemand(demand.demands);
      result.timeBlock = demand.timeBlock;
      result.minPrice = config.minPrice;
      socket.emit('priceQuote', result);
    }catch(e){
      result = {
        price: config.maxPrice,
        timeBlock: demand.timeBlock
      }
      socket.emit('priceQuote', result);
    }
  });
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
  producerNsp.emit('changeProduction', controls);
});

market.startMarket();

// Start DiscoveryClient and register self
var discoveryClient = new DiscoveryClient(config);

