process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var transactions = new (require('./transactions'))(config);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Setup reporter
var reporter = new (require('../utils/adminReporter'))();
global.reporter = reporter;
// Setup middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(config.port);

// Serve admin
app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html')
});

// Serve stats
app.get('/api/stats', function(req, res){
  res.json(reporter.update())
});

// REST API for sending and receiving transactions.
app.post('/api/transactions', function(req, res){
  transactions.commit(req.body);
  res.sendStatus(200);
});

app.get('/api/transactions', function(req, res){
  return transactions.getLatest(function(data){
    res.json(data);
  });
});

app.get('/api/transactions/:consumerid', function(req, res){
  return transactions.getByConsumer(req.params.consumerid, function(data){
    res.json(data);
  });
});

console.log("Running the server file");
console.log("node_env", process.env.node_env); //to check whether it's been set to production when deployed
