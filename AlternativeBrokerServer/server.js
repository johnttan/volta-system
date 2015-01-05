process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var DiscoveryClient = require('../utils/discoveryClient');

var Broker = require('./broker');
var express = require('express');
var app = express();
process.env.node_env = process.env.node_env || 'development';
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

// Start DiscoveryClient and register self
var discoveryClient = new DiscoveryClient(config);

// Serve admin
app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html')
});

var marketNsp = io.of('/market');

function setupSystemClient(){
  discoveryClient.discover('system', 'system', function(err, data){
    if(!err){
      var systemClient = require('socket.io-client')(data[0].ip);
      systemClient.on('connect', function(){
        console.log('connected to system')
      });
      var broker = new Broker(config, marketNsp, systemClient);
      console.log('setup connection to systemClient');
    }else{
      setTimeout(setupSystemClient, 2000)
    }
  });
}

console.log("Running the server file");
console.log("node_env", process.env.node_env); //to check whether it's been set to production when deployed

