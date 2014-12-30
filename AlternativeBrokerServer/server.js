process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var Broker = require('./broker');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var systemClient = require('socket.io-client')(config.systemIp);
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

var marketNsp = io.of('/market');
var broker = new Broker(config, marketNsp, systemClient);

console.log("Running the server file");
console.log("node_env", process.env.node_env); //to check whether it's been set to production when deployed
