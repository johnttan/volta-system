process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var DiscoveryClient = require('../utils/discoveryClient');
var fileLog = require('../utils/fileLog');
global.fileLog = fileLog;
var express = require('express');
var app = express();
// Setup reporter
var reporter = new (require('../utils/adminReporter'))();
global.reporter = reporter;
var Aggregator = require('../utils/aggregator');
// Setup middleware
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);
// Start Aggregation client
var aggregationNsp = io.of('/aggregation');
var aggregations = require('./aggregations');
var aggregator = new Aggregator(aggregationNsp);
aggregator.registerAll(aggregations);
global.aggregator = aggregator;

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
app.get('/api/controls', function(req, res){
  res.json({});
});
app.get('/*', function(req, res){
  res.redirect('/')
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
  aggregator.report('brokers', socket);
  socket.on('disconnect', function() {
    aggregator.report('brokers.disconnect', socket.id);
  });
  market.on('marketClose', function(auction){
    socket.emit('marketClose', auction.currentBlock);
  });
  socket.on('aggregation', function(data){
    aggregator.report('brokers.auctions', data);
  });
  socket.on('queryPrice', function(demand){
    try{
      var result = market.computeBasedOnDemand(demand.demands);
      result.timeBlock = demand.timeBlock;
      result.minPrice = config.minPrice;
      socket.emit('priceQuote', result);
      result.id = socket.id;
      result.time = Date.now();
      aggregator.report('brokers.quotes', result);
    }catch(e){
      console.log('queryPrice', e)
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
  aggregator.report('producers.controls', controls);
});

market.startMarket();

// Start DiscoveryClient and register self
var discoveryClient = new DiscoveryClient(config);

